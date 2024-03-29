import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from "bcryptjs";

export type UserDocument = User & Document;

export enum UserVerify {
    YES = 'YES',
    NO = 'NO'
}

@Schema({ versionKey: false })
export class User {
    @Prop({ type: Object })
    name: {
        first: string,
        last: string
    };

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop({ type: Object })
    photo: {
        url: string
    };

    @Prop()
    phoneNumber: string;

    @Prop()
    isVerified: UserVerify

    @Prop({ nullable: true })
    accessToken: string;

    @Prop({ nullable: true })
    lastLoginDate: Date;

    @Prop({ nullable: true })
    verifiedDate: Date;

    @Prop({ default: new Date() })
    createDate: Date

    @Prop({ nullable: true })
    updateDate?: Date

    @Prop({ nullable: true })
    deleteDate?: Date


    async validatePassword(password: string): Promise<any> {
        const isValidated = await bcrypt.compare(password, this.password);
        return isValidated;
    }
    
}


export const UserSchema = SchemaFactory.createForClass(User);