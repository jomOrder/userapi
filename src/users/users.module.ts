import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userInfo } from 'os';
import { DatabaseModule } from 'src/database/database.module';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { usersProviders } from './users.providers';
import { FacebookStrategy } from 'src/facebook/facebook.strategy';
import { GoogleStrategy } from 'src/google/google.strategy';
import { AppleStrategy } from 'src/apple/apple.strategy';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }])
  ],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders, FacebookStrategy, GoogleStrategy, AppleStrategy]
})
export class UsersModule { }
