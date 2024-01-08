import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { UserService } from 'src/module/admin/user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CustomLoggerService } from 'src/core/services/custom-logger.service';
import { GlobalVariable, Status, UserRole } from 'src/config/enviorments'; // Typo: "environments"
// import axios from 'axios';

@Injectable()
export class LoginService {
  private blacklistedTokens: Set<string> = new Set();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly logger: CustomLoggerService,
  ) {}

  // Method to authenticate user login
  async login(loginDto: CreateLoginDto): Promise<any> {
    try {
      const { email, password, mobile } = loginDto;
      let user;

      if (!email && !mobile) {
        throw new BadRequestException(`${GlobalVariable.BLANK_EMAIL_MOBILE}`);
      }

      if (email) {
        user = await this.userService.findByEmail(email);
      } else {
        user = await this.userService.findByMobile(mobile);
      }

      if (!user) {
        const errorMessage = email
          ? 'Invalid email or email not found'
          : ' Invalid mobile number or mobile number not found';
        throw new UnauthorizedException(errorMessage);
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        throw new UnauthorizedException(GlobalVariable.INCORECT);
      }

      if (!user.isEmailVarified) {
        throw new UnauthorizedException(GlobalVariable.NOT_VERIFY);
      }

      const token = this.jwtService.sign({ id: (user as any)._id });

      return {
        statusCode: HttpStatus.OK,
        message: GlobalVariable.LOGIN,
        data: token,
        user,
      };
    } catch (error) {
      console.error(error);

      const log = this.logger.error(
        `${GlobalVariable.LOG_ERROR} login: ${error}`,
        error.stack,
      );

      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let errorMessage = GlobalVariable.FAIL;
      const errorArray: { [key: string]: string }[] = [];

      if (error instanceof UnauthorizedException) {
        statusCode = HttpStatus.UNAUTHORIZED;
        errorMessage = error.message;
        errorArray.push({ error: error.message });
      } else if (error instanceof BadRequestException) {
        statusCode = HttpStatus.BAD_REQUEST;
        errorMessage = error.message;
        errorArray.push({ error: error.message });
      } else {
        errorArray.push({ error: GlobalVariable.FAIL });
      }

      return {
        statusCode,
        message: errorMessage,
        error: errorArray,
        log,
      };
    }
  }

  async saveUserToDatabase(profile: any): Promise<any> {
    try {
      console.log('save data ');
      const user = await this.userService.findByGoogleId(profile.id);

      if (user) {
        // console.log('User already exists:', user);

        const jwt = await this.googleLogin(user._id);

        return {
          message: 'User already exists',
          user: user,
          token: jwt.access_token,
        };
      } else {
        const fullName = profile.displayName || null;
        const googleId = profile.id;

        const newUser = await this.userService.create({
          email: profile.emails[0].value,
          mobile: null,
          password: '',
          name: fullName,
          role: UserRole.USER,
          status: Status.INACTIVE,
          isEmailVarified: true,
          isMobileVarified: false,
          verifyToken: null,
          passwordResetToken: null,
          passwordResetExpires: null,
          googleId: googleId,
        });

        if (newUser) {
          console.log('New user created', newUser);
          console.log('New user created', newUser.data._id);

          const jwt = await this.googleLogin(newUser.data._id);

          return {
            message: 'New user created',
            user: newUser,
            token: jwt.access_token,
          };
        } else {
          console.log('Failed to create new user');
          return null;
        }
      }
    } catch (error) {
      console.error('Error while creating a new user:', error);
      throw error;
    }
  }

  async googleLogin(user: any): Promise<any> {
    const userId = user && user._id ? user._id.toString() : null; // Ensure user._id exists and convert it to string
    if (!userId) {
      throw new Error('Invalid user or user ID');
    }

    const token = this.jwtService.sign({ id: userId });

    return {
      access_token: token,
    };
  }

  async getGoogleData(req) {
    console.log(5);
    if (!req.user) {
      return 'No user from google';
    }

    return {
      status: 200,
      user: req.user.profile,
    };
  }

  async saveGoogleData(user_data: any): Promise<any> {
    try {
      const user = await this.userService.findByGoogleId(user_data.googleId);
      console.log(1);
      if (user) {
        console.log('User already exists');

        const jwt = await this.googleLogin(user._id);

        return {
          statusCode: HttpStatus.OK,
          message: 'User already exists',
          user: user,
          data: jwt.access_token,
        };
      } else {
        const newUser = await this.userService.create({
          email: user_data.email,
          mobile: null,
          password: '',
          name: user_data.name,
          role: UserRole.USER,
          status: Status.INACTIVE,
          isEmailVarified: true,
          isMobileVarified: false,
          verifyToken: null,
          passwordResetToken: null,
          passwordResetExpires: null,
          googleId: user_data.googleId,
        });

        if (newUser) {
          console.log('New user created', newUser);
          console.log(newUser.data._id);
          const jwt = await this.googleLogin(newUser.data._id);

          return {
            statusCode: HttpStatus.OK,
            message: 'New user created',
            user: newUser,
            data: jwt.access_token,
          };
        } else {
          console.log('Failed to create new user');
          return null;
        }
      }
    } catch (error) {
      console.error('Error while creating a new user:', error);
      throw error;
    }
  }
}
