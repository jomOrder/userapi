import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import config from '../config/config';
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

    async getAllUsers() {
        const userRepository = this.userModel;

        try {

            const users = await userRepository.find();

            return users;

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

    async createUserWithEmail(createUserDto: CreateUserDto): Promise<number> {
        const { email, password, name } = createUserDto;
        const userRepository = this.userModel;


        try {

            const findUser = await userRepository.findOne({ email });

            if (findUser) return HttpStatus.FOUND;

            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

            const user = new this.userModel()
            user.name = name;
            user.password = hashed;
            user.email = email;
            await user.save()

            return HttpStatus.CREATED;

        } catch (e) {
            winston.error(e.message)
        }

    }

    async loginUserWithEmail(createUserDto: CreateUserDto): Promise<void> {
        const { email, password: attemptedPassword } = createUserDto;
        const userRepository = await this.userModel;

        try {

            const user = await userRepository.findOne({ email });
            if (!user) throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'User Not Exist. you need to register',
            }, HttpStatus.NOT_FOUND);

            const validPassword = await bcrypt.compare(attemptedPassword, user.password);
            if (!validPassword) throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: 'password does not match',
            }, HttpStatus.BAD_REQUEST);

            const payload = { userID: user._id };
            //@ts-ignore
            const token = jwt.sign(payload, config.jwtSecret, {
                expiresIn: '1h',
                algorithm: 'HS384'
            });

            throw new HttpException({
                status: HttpStatus.CREATED,
                token,
            }, HttpStatus.CREATED);

        } catch (e) {
            winston.error(e.message);
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
