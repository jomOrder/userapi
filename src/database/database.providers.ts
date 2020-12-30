import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb+srv://produser:4CFkEW5QwVgHPzWh@prodgrep-user.jgzpb.mongodb.net/jom?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true}),
  },
];