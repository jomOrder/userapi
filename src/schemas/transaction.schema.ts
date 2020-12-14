import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserSchema } from './user.schema';

export enum TransactionStatus {
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCELLED = 'CANCELLED'
}

export enum TransactionPaymentMethod {
  CASH = 'CASH',
  ONLINE_BANKING = 'ONLINE_BANKING',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  GRAB_PAY = 'GRAB_PAY',
  TNG = 'TNG',
  BOOST = 'BOOST'
}

export type TransactionDocument = Transaction & Document;

@Schema({ versionKey: false })
export class Transaction {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', indexes: true })
  userID: mongoose.Types.ObjectId;

  @Prop({ required: true })
  transactionID: string

  @Prop({ required: true })
  status: TransactionStatus;

  @Prop({ required: true })
  netTotal: string;

  @Prop({ required: true })
  grossTotal: string;

  @Prop({ required: true })
  totalTax: string;

  @Prop({ required: true })
  paymentMethod: TransactionPaymentMethod

  @Prop({ default: 'MYR' })
  currencyCode: string

  @Prop()
  prepaid: boolean

  @Prop()
  notes: string

  @Prop({ default: Date.now() })
  createDate: Date

  @Prop({ nullable: true })
  updateDate?: Date

  @Prop({ nullable: true })
  deleteDate?: Date

  @Prop({ type: Array })
  orders: [{
    name: string,
    price: string,
    addOns: [
      {
        name: string,
        price: string
      }
    ]
  }];
}

mongoose.model('User', UserSchema);

export const TransactionSchema = SchemaFactory.createForClass(Transaction);