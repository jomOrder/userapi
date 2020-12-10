import { Injectable } from '@nestjs/common';

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

}
