import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile } from "passport-apple";
import * as Strategy from "passport-activedirectory";
import path = require('path');

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, "apple") {
  constructor() {
    super({
      clientID: "com.jomorder.com.app",
      teamID: "79L33V4952",
      keyID: "U5R8YRP8S8",
      callbackURL: `${process.env.PROD_URI}/apple/redirect`,
      privateKeyLocation: path.join(__dirname, '/config/AuthKey_U5R8YRP8S8.p8'),
      passReqToCallback: true,
      scope: "email",
      profileFields: ["emails", "name", "photos"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      photo: photos[0].value
    };
    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}

