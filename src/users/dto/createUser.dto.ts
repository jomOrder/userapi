import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { UserVerify } from '../users.service';
export class CreateUserDto {

    @IsNotEmpty()
    @IsOptional()
    name: {
        first: string,
        last: string
    };

    @IsNotEmpty()
    email: string;

    @IsOptional()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsNotEmpty()
    phoneNumber: string

    @IsOptional()
    @IsIn([UserVerify.YES, UserVerify.NO])
    isVerified: string;

}