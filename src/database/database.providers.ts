import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb+srv://omar:123456Omar@stagingrep.sbvh8.mongodb.net/jom?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true}),
  },
];