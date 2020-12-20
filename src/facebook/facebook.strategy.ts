import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor() {
    super({
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      callbackURL: "http://localhost:3000/api/users/auth/facebook/redirect",
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
    const data = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      photo: photos[0].value
    };
    const payload = {
      data,
      accessToken,
    };

    done(null, payload);
  }
}