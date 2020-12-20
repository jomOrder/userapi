import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/database/database.module';
import { UserSchema } from 'src/schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { usersProviders } from './users.providers';
import { FacebookStrategy } from 'src/facebook/facebook.strategy';
import { GoogleStrategy } from 'src/google/google.strategy';
import { AppleStrategy } from 'src/apple/apple.strategy';
import { Auth } from '../middleware/auth.middleware';
@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }])
  ],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders, FacebookStrategy, GoogleStrategy, AppleStrategy]
})
export class UsersModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(Auth)
  //     .forRoutes({ path: '/api/users', method: RequestMethod.GET})
  //}
}

// install @nestjs/jwt