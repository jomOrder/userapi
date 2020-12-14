import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { jwtSecret } from '../config/config';
import * as winston from 'winston';
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
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
                createDate: -1
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
        const userRepository = this.userModel;

        try {

            const findUser = await userRepository.findOne({ email }).select({ email: 1 })
            if (findUser) return res.send({
                statusCode: HttpStatus.FOUND,
                message: 'User Exist Already. need to register'
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

            return res.send({
                statusCode: HttpStatus.CREATED,
                token,
                meessage: 'User has created',
            });

        } catch (e) {
            winston.error(e.message)
        }

    }

    async loginUserWithEmail(createUserDto: CreateUserDto): Promise<any> {
        const { email, password: attemptedPassword } = createUserDto;
        const userRepository = await this.userModel;

        try {

            const user = await userRepository.findOne({ email }).select({ email: 1 })
            if (!user) return HttpStatus.NOT_FOUND;

            const validPassword = await bcrypt.compare(attemptedPassword, user.password);
            if (!validPassword) throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: 'password does not match',
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

            await user.save();

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

            await user.save();

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

    async signInWithPhoneNumber() {
        try {

        } catch (e) {
            winston.error(e.meesage);
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
