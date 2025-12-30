import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { AuthServiceService } from './auth-service.service';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor(private configService: ConfigService) {
    this.client = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      this.configService.get('GOOGLE_CALLBACK_URL'),
    );
  }

  async handleAuthorizationCode(code: string, authService: AuthServiceService) {
    try {
      if (!code) {
        throw new BadRequestException('Authorization code is missing');
      }

      console.log('[GoogleAuthService] Exchanging authorization code for tokens');

      const { tokens } = await this.client.getToken(code);

      if (!tokens.id_token) {
        throw new UnauthorizedException('Failed to get ID token from Google');
      }

      console.log('[GoogleAuthService] Successfully obtained tokens');

      this.client.setCredentials(tokens);

      const ticket = await this.client.verifyIdToken({
        idToken: tokens.id_token,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();

      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid or missing email in Google token');
      }

      const googleProfile = {
        googleId: payload.sub,
        email: payload.email,
        fullName: payload.name || 'User',
        profilePicture: payload.picture,
      };

      console.log('[GoogleAuthService] Creating or updating user in database');
      const user = await authService.validateOrCreateGoogleUser(googleProfile);

      console.log('[GoogleAuthService] User created/updated successfully:', { 
        user_id: user.user_id, 
        email: user.email 
      });

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      console.error('[GoogleAuthService] Error:', error);

      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException(
        error.message || 'Failed to authenticate with Google',
      );
    }
  }

  async verifyToken(idToken: string): Promise<TokenPayload> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();

      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Google token');
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}