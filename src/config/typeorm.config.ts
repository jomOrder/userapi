import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {

    type: 'mongodb',
    url: '',
    synchronize: true,
    logging: true,
    entities: [__dirname + '/../**/*.entity.ts']

};
