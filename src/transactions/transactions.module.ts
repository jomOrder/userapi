import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/database/database.module';
import { Auth } from 'src/middleware/auth.middleware';
import { TransactionSchema } from 'src/schemas/transaction.schema';
import { UserSchema } from 'src/schemas/user.schema';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: 'transaction', schema: TransactionSchema }, { name: 'user', schema: UserSchema }])
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Auth)
      .forRoutes(TransactionsController)
  }
}
