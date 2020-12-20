import { Body, Controller, Get, Res, Post, Query, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { TransactionsService } from './transactions.service';
@Controller('api/transactions')
export class TransactionsController {
    constructor(private transactionService: TransactionsService) { }

    @Get()
    getTransactions(@Req() req: Request) {
        return this.transactionService.getUserTransaction(req);
    }

    @Post()
    createTransaction(@Body() createTransactionDto: CreateTransactionDto, @Req() req: Request, @Res() res: Response) {
        return this.transactionService.createUserTransaction(createTransactionDto, req, res);
    }
}