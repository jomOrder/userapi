import { IsNotEmpty, IsOptional } from "class-validator";
import { ObjectId } from "mongodb";
import { TransactionPaymentMethod, TransactionStatus } from "src/schemas/transaction.schema";

export class CreateTransactionDto {

    @IsNotEmpty()
    userID: ObjectId;

    @IsNotEmpty()
    transactionID: string

    @IsNotEmpty()
    status: TransactionStatus;

    @IsNotEmpty()
    netTotal: string;

    @IsNotEmpty()
    grossTotal: string;

    @IsNotEmpty()
    totalTax: string;

    @IsNotEmpty()
    paymentMethod: TransactionPaymentMethod

    @IsOptional()
    currencyCode: string

    @IsNotEmpty()
    prepaid: boolean

    @IsOptional()
    notes: string

    @IsNotEmpty()
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