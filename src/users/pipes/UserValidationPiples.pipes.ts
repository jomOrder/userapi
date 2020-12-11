import { BadRequestException, PipeTransform } from "@nestjs/common";

export class UserValidationPiples implements PipeTransform {

    readonly VALUES = [

    ];

    transform(value: any) {
        console.log(value)

        if(value) throw new BadRequestException();
    }

    private isUserVerified(isVerified: any) {
        return isVerified;
    }

}