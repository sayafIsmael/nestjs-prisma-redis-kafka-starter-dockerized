import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

import { UserService } from '../user/user.service';
import { SecurityConfig } from 'src/config/config.interface';
import { AuthProvider } from '@prisma/client';
import { SignupDto } from './dto/signup.dto';
import { OauthSignUpDto } from './dto/oauthSignup.dto';

@Injectable()
export class AuthService {
  private securityConfig: SecurityConfig;
  private oAuthClient: OAuth2Client;

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.securityConfig = this.configService.get<SecurityConfig>('security');
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.oAuthClient = new OAuth2Client(clientId);
  }

  async validateGoogleToken(idToken: string) {
    try {
      const ticket = await this.oAuthClient.verifyIdToken({
        idToken,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      const _payload = {
        email: payload?.email,
        name: payload?.name,
        // picture: payload?.picture,
      };
      return await this.oauthLoginOrSignUp(_payload, AuthProvider.GOOGLE)
    } catch (error) {
      console.log(error)
      throw new UnauthorizedException('Google ID Token verification failed');
    }
  }

  async oauthLoginOrSignUp(payload: OauthSignUpDto, authProvider: AuthProvider) {
    const user = await this.userService.findUserByEmail(payload.email);
    if (!user) {
      const user = await this.userService.createOauthUser(payload, authProvider);
      return this.generateTokens(user.id, user.email);
    }
    const tokens = await this.generateTokens(user.id, user.email);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async signUp(signupDto: SignupDto) {
    const user = await this.userService.createUser(signupDto);
    return this.generateTokens(user.id, user.email);
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.generateTokens(user.id, user.email);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const isRefreshTokenValid = await this.userService.validateRefreshToken(payload.sub, refreshToken);
      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.userService.findUserById(payload.sub);
      const tokens = await this.generateTokens(user.id, user.email);
      await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(userId: string, email: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId, email },
      { expiresIn: this.securityConfig.expiresIn }
    );
    const refreshToken = this.jwtService.sign(
      { sub: userId, email },
      { expiresIn: this.securityConfig.refreshIn },
    );
    return { accessToken, refreshToken };
  }

  async logout(userId: string): Promise<void> {
    // Clear the refresh token in the database
    await this.userService.updateRefreshToken(userId, null);
  }
}
