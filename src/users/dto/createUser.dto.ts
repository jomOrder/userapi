import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { UserVerify } from '../users.service';
export class CreateUserDto {
    @IsNotEmpty()
    email: string;

    @IsOptional()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsNotEmpty()
    phoneNumber: string

    @IsIn([UserVerify.YES, UserVerify.NO])
    isVerified: string;

}