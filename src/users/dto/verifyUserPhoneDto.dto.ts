import { IsMobilePhone, IsNotEmpty, IsOptional } from "class-validator"

export class VerifyUserPhoneDto {

    @IsNotEmpty()
    @IsMobilePhone()
    phoneNumber: string

    @IsNotEmpty()
    @IsOptional()
    code: string
}