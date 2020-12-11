import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import winston from 'winston';
import { userInfo } from 'os';
export interface User {
    id: string;
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

    createUser(createUserDto: CreateUserDto): void {
    }

    getAllUsers() {
        try {

        } catch (e) {
            winston.error(e.message);
        }
    }

    getUserByID(id: string): void {
        try {

            if (!id) throw new NotFoundException(`User with ID ${id} not found`);


        } catch (e) {
            winston.error(e.message);
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
