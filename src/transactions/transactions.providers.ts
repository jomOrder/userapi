import { Connection } from 'mongoose';
import { TransactionSchema } from 'src/schemas/transaction.schema';

export const transactionsProviders = [
  {
    provide: 'transaction',
    useFactory: (connection: Connection) => connection.model('Transaction', TransactionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];