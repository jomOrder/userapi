import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response, Request } from 'express';
import { Model } from 'mongoose';
import { TransactionDocument } from 'src/schemas/transaction.schema';
import { UserDocument } from 'src/schemas/user.schema';
import * as winston from 'winston';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { sendTransactionEmail } from '../service/mailgun.service'
@Injectable()
export class TransactionsService {
    constructor(@InjectModel('transaction') private transactionModel: Model<TransactionDocument>, @InjectModel('user') private userModel: Model<UserDocument>) { }


    async getUserTransaction(req: Request) {

        //@ts-ignore
        const { userID } = req.decoded;
        try {

            const transactions = await this.transactionModel.find({ userID }).populate('transaction').lean().select('-userID');
            return transactions;

        } catch (e) {
            winston.error(e.message);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: e.message
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createUserTransaction(createTransactionDto: CreateTransactionDto, req: Request, res: Response) {
        //@ts-ignore
        const { userID } = req.decoded;
        try {

            // const user = await this.userModel.findOne({ _id: userID });
            // if (user.email) sendTransactionEmail(user.email, createTransactionDto)
            createTransactionDto.userID = userID;
            const transaction = new this.transactionModel(createTransactionDto);
            transaction.save();

            return res.status(HttpStatus.CREATED).send({ code: 9, message: 'Transaction Created' });

        } catch (e) {
            winston.error(e.message);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: e.message
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
