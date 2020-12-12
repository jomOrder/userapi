import { Connection } from 'mongoose';
import { UserSchema } from 'src/schemas/user.schema';

export const usersProviders = [
  {
    provide: 'user',
    useFactory: (connection: Connection) => connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];