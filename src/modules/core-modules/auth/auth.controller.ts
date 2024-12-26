import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiExcludeEndpoint, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthResponseDto } from './dto/authResponse.dto';
import { AuthGuard } from '@nestjs/passport';
import { GoogleSigninDto } from './dto/googleSignin.dto';
import { JwtAuthGuard } from './guard/jwt-auth/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'User Signup' })
  @ApiCreatedResponse({
    description: "Login Successfull!",
    type: AuthResponseDto
  })
  async signUp(@Body() signupDto: SignupDto) {
    return this.authService.signUp(signupDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'User Signin' })
  @ApiCreatedResponse({
    description: "Login Successfull!",
    type: AuthResponseDto
  })
  async signIn(@Body() signinDto: SigninDto) {
    return this.authService.signIn(signinDto.email, signinDto.password);
  }

  @Get('google')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get('google/redirect')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return {
      message: 'User information from Google',
      user: req.user,
    };
  }

  @Post('google/validate')
  @ApiOperation({ summary: 'Validate Google Signin' })
  async googleAuthValidate(@Body() googleSigninDto: GoogleSigninDto) {
     // Validate the ID token
     return await this.authService.validateGoogleToken(googleSigninDto.idToken);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh Token' })
  @ApiCreatedResponse({
    description: "Login Successfull!",
    type: AuthResponseDto
  })
  async refreshToken(@Body() refreshDto: RefreshDto) {
    return this.authService.refreshToken(refreshDto.refreshToken);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user!' })
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    const userId = req.user.sub; // Extract the user ID from the request
    await this.authService.logout(userId);
    return { message: 'Logged out successfully!' };
  }
}
