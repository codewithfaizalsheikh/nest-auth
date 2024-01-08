import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Param,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { UserService } from 'src/module/admin/user/user.service';
import * as crypto from 'crypto';
import { GlobalVariable } from 'src/config/enviorments';
import { EmailService } from 'src/core/services/email.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);
@Controller('auth')
export class LoginController {
  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private readonly emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  // Endpoint to handle user login
  @Post('login')
  async login(@Body() loginDto: CreateLoginDto): Promise<{ token: string }> {
    try {
      // Attempt user login using the provided login data
      const result = await this.loginService.login(loginDto);
      return result; // Return the generated token upon successful login
    } catch (error) {
      // Throw an HTTP exception if login fails
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to login',
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('data')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    if (!req.user) {
      return 'No user from google';
    }
    // console.log(req.user);
    res.status(200).json({
      status: 200,
      message: 'Login Successfullqqq',
      user: req.user,
    });

    // res.redirect('http://localhost:5026/user');
  }

  @Post('google/login')
  async googleLogin(@Body('token') token: string): Promise<any> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const user_data = {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
    };
    return await this.loginService.saveGoogleData(user_data);
  }

  @Get('check-email')
  async checkEmail(@Body('email') email: string): Promise<any> {
    const exists = await this.userService.checkEmailExists(email);
    if (exists === true) {
      return { message: GlobalVariable.EXIST };
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      // Handle case where user with email doesn't exist
      return { message: 'Email not found' };
    }

    const token = crypto.randomBytes(20).toString('hex');

    const resetExpires = new Date(Date.now() + 3600000); // Set expiration to 1 hour from now

    // Update user's document with token and expiry date
    await this.userService.updateResetToken(user._id, token, resetExpires);

    const subject = 'Password Reset';
    const text =
      `You are receiving this because you have requested the reset of the password for your account.\n\n` +
      `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
      `http://localhost:3000/auth/reset/${token}\n\n` +
      `If you did not request this, please ignore this email and your password will remain unchanged.\n`;

    await this.emailService.sendEmail(user.email, subject, text);

    return { message: 'Reset email sent', token };
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() body: { password: string },
  ) {
    // Check if the password is empty or less than 6 characters
    if (!body.password || body.password.length < 6) {
      throw new HttpException(
        'Password must be at least 6 characters long',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userService.findByResetToken(token);

    if (!user || user.passwordResetExpires < new Date()) {
      // Handle invalid or expired token
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Update user's password and clear the reset token
    await this.userService.updatePassword(user._id, body.password);
    await this.userService.clearResetToken(user._id);

    return { message: 'Password updated successfully' };
  }

  @Get('email-verify/:token')
  async verifyEmail(@Param('token') token: string) {
    const user = await this.userService.findByVerifyToken(token);

    if (!user || user.passwordResetExpires < new Date()) {
      // Handle invalid or expired token
      return { message: 'Invalid or expired token' };
    }

    // Update user's password and clear the reset token
    await this.userService.isEmailVerified(user._id);

    return { message: 'Email verified successfully' };
  }

  @Post('resend-verify-email')
  async reSendVerifyEmail(@Body() body: { email: string }) {
    try {
      const user = await this.userService.findByEmail(body.email);
      if (!user) {
        // Handle case where user with email doesn't exist
        return { message: 'Email not found' };
      }

      const token = crypto.randomBytes(20).toString('hex');

      const resetExpires = new Date(Date.now() + 3600000); // Set expiration to 1 hour from now

      // Update user's document with token and expiry date
      await this.userService.updateVerifyToken(user.email, token, resetExpires);

      const subject = 'Verify Email';
      const text =
        `You are receiving this because you have requested the Re-Verify email for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `https://api-saaskit.imenso.in/auth/email-verify/${token}\n\n` +
        `If you did not request this, please ignore this email.\n`;

      await this.emailService.sendEmail(user.email, subject, text);

      return { message: 'Verify email sent successfully', token };
    } catch (error) {
      // Handle the error
      console.error(error.message); // Log the error for debugging purposes

      // Return an error response
      return { message: 'Failed to resend verification email' + error };
    }
  }
}
