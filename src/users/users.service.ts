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
import { FB, FacebookApiException } from 'fb';
import { VerifyUserPhoneDto } from './dto/verifyUserPhoneDto.dto';
import { promisify } from 'util';

const client = redis.createClient({ port: 6379, host: "127.0.0.1" });
const getAsync = promisify(client.get).bind(client);
const emailValidator = new EmailValidator();

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

    getAllUsers() {
        const userRepository = this.userModel;

        try {

            return userRepository.find().sort({
                verifiedDate: 1
            }).select(["email", "name"])


        } catch (e) {
            winston.error(e.message);
            throw new NotFoundException('Users not found');
        }
    }

    getUserByID(id: string): void {
        try {

            if (!id) throw new NotFoundException(`User with ID ${id} not found`);


        } catch (e) {
            winston.error(e.message);
        }
    }

    async createUserWithEmail(createUserDto: CreateUserDto, res): Promise<any> {
        const { email, password, name } = createUserDto;
        try {

            const isEmailVaild = Validator.validate(email);
            if (!isEmailVaild) return res.send({
                code: 20,
                message: 'User Email Not Valid.'
            });

            let findUser = await this.userModel.findOne({ email }).exec();

            if (findUser) return res.status(HttpStatus.FOUND).send({
                code: 11,
                message: 'User Exist Already. Need to Sign In'
            });

            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

            const user = new this.userModel({
                name,
                password: hashed,
                email
            });
            user.save()
            const payload = { userID: user._id };
            const token = jwt.sign(payload, jwtSecret, {
                expiresIn: '1h',
                algorithm: 'HS384'
            });

            return res.status(HttpStatus.CREATED).send({
                code: 9,
                token,
                meessage: 'User has created',
            });

        } catch (e) {
            winston.error(e.message)
        }

    }

    async loginUserWithEmail(createUserDto: CreateUserDto, res): Promise<any> {
        const { email, password: attemptedPassword } = createUserDto;

        try {

            const user = await this.userModel.findOne({ email }).select(["email", "isVerified"])
            if (!user) return HttpStatus.NOT_FOUND;

            const validPassword = await bcrypt.compare(attemptedPassword, user.password);
            if (!validPassword) throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Password Does Not Match',
            }, HttpStatus.BAD_REQUEST);

            const payload = { userID: user._id };
            const token = jwt.sign(payload, jwtSecret, {
                expiresIn: '1h',
                algorithm: 'HS384'
            });

            return {
                status: HttpStatus.CREATED,
                token
            }

        } catch (e) {
            winston.error(e.message);
        }

    }

    async loginWithFacebook(req): Promise<any> {
        const { firstName, lastName, email, photo } = req.user.data;
        let payload = null;
        let token = null;
        try {

            const findUser = await this.userModel.findOne({ email }).select({ email: 1 });


            if (findUser) {
                payload = { userID: findUser._id };

                token = jwt.sign(payload, jwtSecret, {
                    expiresIn: '1h',
                    algorithm: 'HS384'
                });
                return { message: 'User Sigin Successfully.', token, statusCode: HttpStatus.OK }
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
                isVerified: 'YES',
                accessToken: req.user.accessToken,
                verifiedDate: new Date()
            });

            user.save();

            if (user) payload = { userID: user._id };
            token = jwt.sign(payload, jwtSecret, {
                expiresIn: '1h',
                algorithm: 'HS384'
            });

            return { message: 'User Created.', token, statusCode: HttpStatus.CREATED }

        } catch (e) {
            winston.error(e.message);
        }
    }

    async loginWithGoogle(req): Promise<any> {
        const { email, firstName, lastName, picture } = req.user;
        let payload = null;
        let token = null;

        try {

            const findUser = await this.userModel.findOne({ email }).select({ email: 1, accessToken: 1 })
            if (findUser) {
                if (findUser.accessToken) return { message: 'User exist with facebook account. please try to signin with facebook', statusCode: HttpStatus.OK }
                payload = { userID: findUser._id };

                token = jwt.sign(payload, jwtSecret, {
                    expiresIn: '1h',
                    algorithm: 'HS384'
                });
                return { message: 'User Sigin Successfully.', token, statusCode: HttpStatus.OK }

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
                isVerified: 'YES',
                verifiedDate: new Date()
            });

            user.save();

            if (user) payload = { userID: user._id };
            token = jwt.sign(payload, jwtSecret, {
                expiresIn: '1h',
                algorithm: 'HS384'
            });


            return { message: 'User Created.', token, statusCode: HttpStatus.CREATED }

        } catch (e) {
            winston.error(e);
        }

    }

    async signInWithPhoneNumber(verifyUserPhoneDto: VerifyUserPhoneDto, res): Promise<any> {
        const { phoneNumber } = verifyUserPhoneDto;
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        try {

            const findUser = await this.userModel.findOne({ phoneNumber })
            if (findUser && findUser.isVerified)
                return {
                    code: 20,
                    message: 'User Registered and Verified'
                }

            const user = new this.userModel({
                phoneNumber
            });

            user.save();
            // send SMS OTP Code;

            client.set(phoneNumber, code);
            client.expire(phoneNumber, 180);
            return res.status(HttpStatus.CREATED).send({
                code: 9,
                otpCode: code,
                message: 'User Created.'
            });
            // End Send SMS OTP Code;

        } catch (e) {
            winston.error(e.meesage);
        }
    }

    async verifyOTPCode(verifyUserPhone: VerifyUserPhoneDto, res): Promise<any> {
        const { phoneNumber, code } = verifyUserPhone;
        const userRepository = await this.userModel;

        try {

            const result = await getAsync(phoneNumber);

            if (!result) return res.status(HttpStatus.OK).send({
                code: 19,
                message: 'Code Expired. Please Request again'
            });
            if (result != code) return res.status(HttpStatus.BAD_REQUEST).send({ code: 20, message: 'Code is not valid' });
            const user = userRepository.findOne({ phoneNumber })
            if (!user)
                return {
                    code: 19,
                    message: 'User Not Found'
                }

            user.update({ isVerified: UserVerify.YES, verifiedDate: new Date() }).exec();

            return res.status(HttpStatus.CREATED).send({ code: 10, message: 'User has verified successfully' });

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
 * 5
 * 
 */