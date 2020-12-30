import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as helmet from 'helmet';
import * as morgan from "morgan";
import { NotFoundExceptionFilter } from './utils/NotFoundExceptionFilter.utils';
import * as passport from 'passport';
dotenv.config();
import path = require('path');
const AppleStrategy = require('passport-apple');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(morgan('dev'));
  app.enableCors();
  passport.use(new AppleStrategy({
    clientID: "com.jomorder.com.app",
    teamID: "79L33V4952",
    keyID: "U5R8YRP8S8",
    callbackURL: `${process.env.PROD_URI}/apple/redirect`,
    privateKeyLocation: path.join(__dirname, '/config/AuthKey_U5R8YRP8S8.p8'),
    passReqToCallback: true,
  }, function (req, accessToken, refreshToken, decodedIdToken, profile, cb) {
    console.log(profile)
    // Here, check if the decodedIdToken.sub exists in your database!
    // decodedIdToken should contains email too if user authorized it but will not contain the name
    // `profile` parameter is REQUIRED for the sake of passport implementation
    // it should be profile in the future but apple hasn't implemented passing data
    // in access token yet https://developer.apple.com/documentation/sign_in_with_apple/tokenresponse
    const user = {
      profile,
      accessToken
    }
    cb(null, decodedIdToken, user);
  }));
  // app.use("/auth/google").get(
  //   passport.authenticate("apple", { scope: ["h"] }));
  app.useGlobalFilters(new NotFoundExceptionFilter());
  await app.listen(process.env.PROD_PORT);
}
bootstrap();
