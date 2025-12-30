import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthServiceService } from './auth-service.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthServiceService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!, // ✅ non-null assertion
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
      // passReqToCallback is not needed since we are not using req in validate
    });
  }

  // Note: No 'req' here, matches StrategyOptions without passReqToCallback
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, displayName, photos } = profile;
    const email = emails?.[0]?.value;
    const profilePicture = photos?.[0]?.value;
    const user = await this.authService.validateOrCreateGoogleUser({
      googleId: id,
      email,
      fullName: displayName,
      profilePicture,
    });

    done(null, user);
  }
}
