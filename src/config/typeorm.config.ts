import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mongodb',
    url: 'mongodb+srv://omar:123456Omar@stagingrep.sbvh8.mongodb.net/jom?retryWrites=true&w=majority',
    synchronize: true,
    logging: true,
    useNewUrlParser: true,
    entities: [__dirname + '/../**/*.entity.ts']

};
