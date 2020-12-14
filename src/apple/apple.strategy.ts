import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile } from "passport-apple";
import * as Strategy from "passport-activedirectory";

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, "apple") {
  constructor() {
    super({
      clientID: "",
      callbackURL: "http://localhost:3000/users/auth/apple/redirect",
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