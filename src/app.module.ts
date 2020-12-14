import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://omar:123456Omar@stagingrep.sbvh8.mongodb.net/jom?retryWrites=true&w=majority'),
    UsersModule,
    TransactionsModule
  ],
  providers: [],
})
export class AppModule { }
