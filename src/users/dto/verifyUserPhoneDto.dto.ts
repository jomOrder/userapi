import { isNotEmpty, IsNotEmpty, IsOptional } from "class-validator"

export class VerifyUserPhoneDto {

    @IsNotEmpty()
    phoneNumber: string

    @IsNotEmpty()
    @IsOptional()
    code: string
}