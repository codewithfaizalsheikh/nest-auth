import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { LoginService } from 'src/module/auth/login/login.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly loginService: LoginService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5026/auth/data', // Change accordingly
      scope: ['email', 'profile'],
    });
  }

  // authorizationParams(): { [key: string]: string } {
  //   return {
  //     access_type: 'offline',
  //     prompt: 'consent',
  //   };
  // }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    // const { name, emails, photos } = profile;
    const user = {
      profile: profile,
      accessToken,
    };
    console.log('google strategy');
    try {
      await this.loginService.saveUserToDatabase(profile);
    } catch (error) {
      console.log(error.message);
    }
    done(null, user);
  }
}
