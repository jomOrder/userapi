import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { TransactionDocument } from 'src/schemas/transaction.schema';

@Injectable()
export class TransactionsService {
    constructor(@InjectModel('transaction') private transactionModel: Model<TransactionDocument>) { }


    async getAllTransaction() {
        const createdCat = new this.transactionModel();
        createdCat.transactionID = "34325434674321"
        createdCat.orders = [
            {
                name: 'Nasi',
                price: "21.20",
                addOns: [{ name: 's', price: "20.30"}]
            }
        ]
        createdCat.userID = new ObjectId('5fd4a1dd4d7d64185040d915')
        await createdCat.save();

        const transactions = await this.transactionModel.find({ userID: '5fd4a1dd4d7d64185040d915' }).populate('transaction')
        console.log(transactions)
        return transactions
        // const newStory  = new this.transactionModel();
        // newStory.transactionID = 'Casino Royale';
        // newStory.author = newPerson._id;
        // await newStory.save();

        // return this.transactionModel.find();
    }
}
