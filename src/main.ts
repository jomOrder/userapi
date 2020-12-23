import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as helmet from 'helmet';
import { NotFoundExceptionFilter } from './utils/NotFoundExceptionFilter.utils';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  app.useGlobalFilters(new NotFoundExceptionFilter());
  await app.listen(80);
}
bootstrap();
