import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mongodb',
    url: '',
    synchronize: true,
    logging: true,
    useNewUrlParser: true,
    // entities: [join(__dirname, 'src/**/*.entity.{js,ts}')]
}