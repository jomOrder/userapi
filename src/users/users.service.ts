import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { jwtSecret } from '../config/config';
import * as winston from 'winston';
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as Validator from 'email-validator'
import * as EmailValidator from 'email-deep-validator';
import * as redis from 'redis';
import * as Queue from 'bee-queue';
import { FB, FacebookApiException } from 'fb';
import { VerifyUserPhoneDto } from './dto/verifyUserPhoneDto.dto';
import { promisify } from 'util';
import { Response } from 'express';
import { sendUserEmailVerification } from 'src/service/mailgun.service';
import { sendVerificationSMS } from 'src/service/smsBulk.service';

import { EmailVerificationDto } from './dto/emailVerification.dto';
const client = redis.createClient({ port: 6379, host: "redis-core.jomorder.com.my" });
const getAsync = promisify(client.get).bind(client);
const emailValidator = new EmailValidator();

// const sharedConfig = {
//     getEvents: false,
//     isWorker: false,
//     redis: redis.createClient({ port: 6379, host: "127.0.0.1" }),
// };

export interface User {
    email: string;
    password: string;
    phoneNumber: string;
    isVerified: UserVerify
}

export enum UserVerify {
    YES = 'YES',
    NO = 'NO'
}

@Injectable()
export class UsersService {
    constructor(@InjectModel("user") private userModel: Model<UserDocument>) { }

    async viewUser(req) {

        try {

            //@ts-ignore
            const { userID } = req.decoded;

            return this.userModel.findOne({ _id: userID }).select(["email", "name"]);

        } catch (e) {
            winston.error(e.message);
            throw new NotFoundException('Users not found');
        }
    }
    async createUserWithEmail(createUserDto: CreateUserDto, res: Response): Promise<any> {
        const { email, password, name, phoneNumber } = createUserDto;
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        try {

            const isEmailVaild = Validator.validate(email);
            if (!isEmailVaild) return res.send({
                code: 20,
                message: 'User Email Not Valid.'
            });

            let findUser = await this.userModel.find({ $or: [{ phoneNumber }, { email }] });
            if (findUser.length > 0) return res.status(HttpStatus.OK).send({
                code: 11,
                message: 'User Exist Already. Need to Sign In'
            });

            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

            const user = new this.userModel({
                name,
                phoneNumber,
                password: hashed,
                email
            });
            user.save()

            /* Send an emailVerification
                let auth_link = `${process.env.PROD_URI}/verify/email?authorization=${token}&email=${email}`
                sendUserEmailVerification(email, auth_link)
            // end emailVerification*/

            sendVerificationSMS(phoneNumber, code);
            client.set(phoneNumber, code);
            client.expire(phoneNumber, 180);

            return res.status(HttpStatus.CREATED).send({
                code: 9,
                otpCode: code,
                message: 'User has created',
            });

        } catch (e) {
            winston.error(e.message);
            throw new HttpException({
                message: e.message
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async emailVerification(emailVerificationDto: EmailVerificationDto, res: Response) {
        const { email, authorization } = emailVerificationDto;
        try {


            const user = await this.userModel.findOne({ email });

            if (user.isVerified) return res.status(HttpStatus.FORBIDDEN).send({ message: 'Expired' });

            await jwt.verify(authorization, jwtSecret);


            user.updateOne({ isVerified: UserVerify.YES, verifiedDate: new Date() }).exec();

            const payload = { userID: user._id };
            const accessToken = jwt.sign(payload, jwtSecret, {
                expiresIn: '1h',
                algorithm: 'HS384'
            });

            return res.setTimeout(400).redirect(301, `${process.env.STAG_APP_URL}/store?accessToken=${accessToken}`);

        } catch (e) {
            winston.error(e.message);
            throw new HttpException({
                message: e.message
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async loginUserWithEmail(createUserDto: CreateUserDto, res: Response): Promise<any> {
        const { email, password: attemptedPassword } = createUserDto;
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        try {

            const user = await this.userModel.findOne({ email }).select(["email", "isVerified", "phoneNumber", "password"])
            if (!user) return res.status(HttpStatus.OK).send({
                code: 19,
                message: 'User Not Found'
            });

            if (!user.isVerified) {
                const { phoneNumber } = user;
                sendVerificationSMS(phoneNumber, code);
                client.set(phoneNumber, code);
                client.expire(phoneNumber, 180);

                return res.status(HttpStatus.OK).send({
                    code: 22,
                    phoneNumber,
                    message: 'User UNAUTHORIZED'
                });

            }

            const validPassword = await bcrypt.compare(attemptedPassword, user.password);
            if (!validPassword) return res.status(HttpStatus.OK).send({
                code: 25,
                message: 'Password Does Not Match',
            });

            const payload = { userID: user._id };
            const token = jwt.sign(payload, jwtSecret, {
                expiresIn: '1h',
                algorithm: 'HS384'
            });

            return res.status(HttpStatus.OK).send({
                code: 29,
                message: 'User Login Successfully',
                token
            })

        } catch (e) {
            winston.error(e.message);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: e.message
            }, HttpStatus.OK);
        }

    }

    async loginWithFacebook(req, res: Response): Promise<any> {
        const { firstName, lastName, email, photo } = req.user.data;
        let payload = null;
        let token = null;
        try {

            const findUser = await this.userModel.findOne({ email }).select("email");


            if (findUser) {
                payload = { userID: findUser._id };

                token = jwt.sign(payload, jwtSecret, {
                    expiresIn: '1h',
                    algorithm: 'HS384'
                });

                return res.redirect(301, `${process.env.STAG_APP_URL}/store?accessToken=${token}`);
            }
            const user = new this.userModel({
                name: {
                    first: firstName,
                    last: lastName
                },
                email,
                photo: {
                    url: photo
                },
                isVerified: UserVerify.YES,
                accessToken: req.user.accessToken,
                verifiedDate: new Date()
            });

            user.save();

            if (user) payload = { userID: user._id };
            token = jwt.sign(payload, jwtSecret, {
                expiresIn: '1h',
                algorithm: 'HS384'
            });

            return res.redirect(301, `${process.env.STAG_APP_URL}/store?accessToken=${token}`);

        } catch (e) {
            winston.error(e.message);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: e.message
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async loginWithGoogle(req, res: Response): Promise<any> {
        const { email, firstName, lastName, picture } = req.user;
        let payload = null;
        let token = null;

        try {

            const findUser = await this.userModel.findOne({ email }).select(["email", "accessToken"])
            if (findUser) {
                if (findUser.accessToken) return res.status(HttpStatus.OK).send({ message: 'User exist with facebook account. please try to signin with facebook', code: 40 });

                payload = { userID: findUser._id };
                token = jwt.sign(payload, jwtSecret, {
                    expiresIn: '1h',
                    algorithm: 'HS384'
                });

                return res.redirect(301, `${process.env.STAG_APP_URL}/store?accessToken=${token}`);
            }

            const user = new this.userModel({
                name: {
                    first: firstName,
                    last: lastName
                },
                email,
                photo: {
                    url: picture
                },
                isVerified: UserVerify.YES,
                verifiedDate: new Date()
            });

            user.save();

            if (user) payload = { userID: user._id };
            token = jwt.sign(payload, jwtSecret, {
                expiresIn: '1h',
                algorithm: 'HS384'
            });

            return res.redirect(301, `${process.env.STAG_APP_URL}/store?accessToken=${token}`);

        } catch (e) {
            winston.error(e);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: e.message
            }, HttpStatus.OK);
        }

    }

    async signInWithPhoneNumber(verifyUserPhoneDto, res: Response): Promise<any> {
        const { phoneNumber } = verifyUserPhoneDto;
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        try {

            const findUser = await this.userModel.findOne({ phoneNumber })
            if (findUser && findUser.isVerified) {

                const payload = { userID: findUser._id };
                const token = jwt.sign(payload, jwtSecret, {
                    expiresIn: '1h',
                    algorithm: 'HS384'
                });
                return res.status(HttpStatus.OK).send({
                    code: 29,
                    token,
                    message: 'User Sign In and Verified'
                });
            }


            if (findUser && !findUser.isVerified) {
                sendVerificationSMS(phoneNumber, code);
                client.set(phoneNumber, code);
                client.expire(phoneNumber, 180);


                return res.status(HttpStatus.OK).send({
                    code: 30,
                    otpCode: code,
                    message: 'User Registered But Not Verified'
                });
            }

            const user = new this.userModel({
                phoneNumber
            });

            user.save();
            // send SMS OTP Code;
            sendVerificationSMS(phoneNumber, code);
            client.set(phoneNumber, code);
            client.expire(phoneNumber, 180);
            return res.status(HttpStatus.CREATED).send({
                code: 9,
                otpCode: code,
                message: 'User Created.'
            });
            // End Send SMS OTP Code;

        } catch (e) {
            winston.error(e.message);
        }
    }

    async verifyOTPCode(verifyUserPhone: VerifyUserPhoneDto, res: Response): Promise<any> {
        const { phoneNumber, code } = verifyUserPhone;

        try {

            const result = await getAsync(phoneNumber);

            if (!result) return res.status(HttpStatus.OK).send({
                code: 21,
                message: 'Code Expired. Please Request again'
            });
            if (result != code) return res.status(HttpStatus.OK).send({ code: 20, message: 'Code is not valid' });
            const user = await this.userModel.findOne({ phoneNumber })
            if (!user)
                return {
                    code: 19,
                    message: 'User Not Found'
                }

            user.updateOne({ isVerified: UserVerify.YES, verifiedDate: new Date() }).exec();

            const payload = { userID: user._id };
            const token = jwt.sign(payload, jwtSecret, {
                expiresIn: '1h',
                algorithm: 'HS384'
            });

            return res.status(HttpStatus.OK).send({ code: 29, token, message: 'User has verified successfully' });

        } catch (e) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: e.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }


    }


    removeUser(id: string): void {

    }

    updateUser(id: string): void {
        try {

            if (!id) throw new NotFoundException()


        } catch (e) {
            winston.error(e.message)
        }
    }
}

/**
 * ---------------
 * Message Code
 * ---------------
 *
 * User Created     => 9
 * User Not Found   => 19
 * UNAUTHORIZED     => 22
 * Expired          => 21
 * Not Vaild        => 20
 * Verified         => 29
 * Not Verified     => 30
 * Bad Request      => 40

 */