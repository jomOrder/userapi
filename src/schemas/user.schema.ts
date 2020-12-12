import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
    verifiedDate: Date;

    @Prop({ default: Date.now() })
    createDate: Date

    @Prop({ nullable: true })
    updateDate?: Date

    @Prop({ nullable: true })
    deleteDate?: Date


}


export const UserSchema = SchemaFactory.createForClass(User);