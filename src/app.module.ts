import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://produser:4CFkEW5QwVgHPzWh@prodgrep-user.jgzpb.mongodb.net/jom?retryWrites=true&w=majority', { useNewUrlParser: true}),
    UsersModule,
    TransactionsModule
  ],
  providers: [],
})
export class AppModule { }
