import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GlobalVariable } from 'src/config/enviorments';
import * as bcrypt from 'bcryptjs'; // Library for password hashing
import { InjectModel } from '@nestjs/mongoose'; // Injected Mongoose model
import { Model } from 'mongoose'; // Mongoose Model
import { User } from './entities/user.entity';
import { CustomLoggerService } from 'src/core/services/custom-logger.service';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { EmailService } from 'src/core/services/email.service';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>, // Injected user model
    private readonly logger: CustomLoggerService,
    private readonly emailService: EmailService,
  ) {}

  async checkEmailExists(email: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();
    return !!user;
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    const {
      name,
      email,
      mobile,
      password,
      role,
      status,
      isEmailVarified,
      isMobileVarified,
      googleId,
    } = createUserDto;

    try {
      // Check if the email or mobile number already exists in the database
      const existingEmailUser = await this.userModel.findOne({ email });

      if (existingEmailUser) {
        throw new BadRequestException(
          `Email: ${email} ${GlobalVariable.EXIST}`,
        );
      }

      const existingMobileUser = await this.userModel.findOne({ mobile });

      if (mobile !== null) {
        if (existingMobileUser) {
          throw new BadRequestException(
            `Mobile: ${mobile} ${GlobalVariable.EXIST}`,
          );
        }
      }

      // return { message: 'Verify email sent successfully', token };

      // Hash the password before storing it
      const hashPass = await bcrypt.hash(password, 10);
      const user = await this.userModel.create({
        name,
        email,
        mobile,
        password: hashPass,
        role,
        status,
        isEmailVarified,
        isMobileVarified,
        googleId,
      });
      if (user.isEmailVarified === false) {
        const token = crypto.randomBytes(20).toString('hex');

        const resetExpires = new Date(Date.now() + 3600000); // Set expiration to 1 hour from now

        // Update user's document with token and expiry date
        await this.updateVerifyToken(email, token, resetExpires);

        const subject = 'Verify Email';
        const text =
          `You are receiving this because you have requested the Verify email for your account.\n\n` +
          `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
          `https://api-saaskit.imenso.in/auth/email-verify/${token}\n\n` +
          `If you did not request this, please ignore this email.\n`;

        await this.emailService.sendEmail(createUserDto.email, subject, text);
      }

      return {
        statusCode: HttpStatus.OK,
        message: GlobalVariable.CREATE,
        data: user,
      };
    } catch (error) {
      console.log(error); // Log the error for debugging purposes

      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let errorMessage = GlobalVariable.FAIL;
      const errorArray: { [key: string]: string }[] = [];

      if (error instanceof UnauthorizedException) {
        statusCode = HttpStatus.UNAUTHORIZED;
        errorMessage = error.message;
        errorArray.push({ unauthorizedError: error.message });
      } else if (error instanceof BadRequestException) {
        statusCode = HttpStatus.BAD_REQUEST;
        errorMessage = error.message;
        errorArray.push({ error: error.message });
      } else {
        errorArray.push({ error: GlobalVariable.FAIL });
      }

      const log = this.logger.error(
        `${GlobalVariable.LOG_ERROR} creation: ${error}`,
        error.stack,
      );
      return {
        statusCode: statusCode, // You can set an appropriate error status code
        message: errorMessage,
        error: error.message, // Include the error message in the response
        log,
      };
    }
  }

  async findAll(): Promise<any> {
    try {
      const users = await this.userModel.find().exec();
      const totalCount = await this.userModel.countDocuments();

      return {
        statusCode: 200,
        totalCount,
        message: GlobalVariable.FETCH,
        data: users,
      };
    } catch (error) {
      console.log(error); // Log the error for debugging purposes

      const logs = this.logger.error(
        `${GlobalVariable.LOG_ERROR} fetch: ${error}`,
        error.stack,
      ); //custom logger

      return {
        statusCode: 500, // You can set an appropriate error status code
        message: GlobalVariable.FETCH_FAIL,
        error: error.message, // Include the error message in the response
        logs,
      };
    }
  }

  // Method to update user details by ID
  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      const { password, ...rest } = updateUserDto;

      if (password) {
        // Hash the new password before updating
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await this.userModel.findByIdAndUpdate(
          id,
          { ...rest, password: hashedPassword },
          {
            new: true,
            runValidators: true,
          },
        );

        if (!updatedUser) {
          throw new NotFoundException(GlobalVariable.NOT_FOUND);
        }

        return {
          statusCode: 200,
          message: GlobalVariable.UPDATE,
          data: updatedUser,
        };
      } else {
        // If password is not provided, update other user details except password
        const updatedUser = await this.userModel.findByIdAndUpdate(
          id,
          { ...rest },
          {
            new: true,
            runValidators: true,
          },
        );

        if (!updatedUser) {
          throw new NotFoundException(GlobalVariable.NOT_FOUND);
        }

        return {
          statusCode: 200,
          message: GlobalVariable.UPDATE,
          data: updatedUser,
        };
      }
    } catch (error) {
      console.log(error); // Log the error for debugging purposes

      const log = this.logger.error(
        `${GlobalVariable.LOG_ERROR} update: ${error}`,
        error.stack,
      );

      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR; // Default to Internal Server Error

      if (error instanceof NotFoundException) {
        statusCode = HttpStatus.NOT_FOUND; // Use 404 status for user not found
      }

      return {
        statusCode,
        message: GlobalVariable.UPDATE_FAIL,
        error: error.message, // Include the error message in the response
        log,
      };
    }
  }

  async profile_image_upload(id, file, uniqueFileName) {
    const user = await this.userModel.findById(id);
    if (user) {
      const destination = `/img/user/${id}`; // Your desired upload directory

      const oldFilePath = './public/' + user.profileImage; // Get the old file path
      // console.log(oldFilePath);
      if (oldFilePath && fs.existsSync(oldFilePath)) {
        // Delete the old file if it exists
        await fs.promises.unlink(oldFilePath);
      }
      const fileDetails = {
        originalName: file.originalname,
        fileName: uniqueFileName,
        filePath: path.join(destination, uniqueFileName),
      };
      user.profileImage = fileDetails.filePath;
      await user.save();
      return user.profileImage;
    } else {
      throw new Error('User not found');
    }
  }

  // Method to delete a user by ID
  async remove(id: string): Promise<any> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id);

      if (!deletedUser) {
        throw new NotFoundException(GlobalVariable.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        message: GlobalVariable.DELETE_SUCCESS,
        data: deletedUser,
      };
    } catch (error) {
      console.log(error); // Log the error for debugging purposes

      const log = this.logger.error(
        `${GlobalVariable.LOG_ERROR} reset: ${error}`,
        error.stack,
      );

      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR; // Default to Internal Server Error

      if (error instanceof NotFoundException) {
        statusCode = HttpStatus.NOT_FOUND; // Use 404 status for user not found
      }

      return {
        statusCode,
        message: GlobalVariable.DELETE_FAIL,
        error: error.message, // Include the error message in the response
        log,
      };
    }
  }

  // Method to find a single user by ID
  async findById(_id: string): Promise<any | null> {
    try {
      return this.userModel.findById({ _id }).exec();
    } catch (error) {
      console.log(error); // Log the error for debugging purposes

      const log = this.logger.error(
        `${GlobalVariable.LOG_ERROR} fetch: ${error}`,
        error.stack,
      );

      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: GlobalVariable.FETCH_FAIL,
        error: error.message, // Include the error message in the response
        log,
      };
    }
  }

  async findByEmail(email: string): Promise<any | null> {
    try {
      return this.userModel.findOne({ email }).exec(); // Using findOne with email as a criteria
    } catch (error) {
      console.log(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: GlobalVariable.FETCH_FAIL,
        error: error.message,
      };
    }
  }

  async findByMobile(mobile): Promise<any | null> {
    try {
      return this.userModel.findOne({ mobile }).exec(); // Using findOne with email as a criteria
    } catch (error) {
      console.log(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: GlobalVariable.FETCH_FAIL,
        error: error.message,
      };
    }
  }

  async updateResetToken(
    userId: string,
    token: string,
    resetExpires: Date,
  ): Promise<void> {
    // Update user document with the new reset token and expiry date
    await this.userModel
      .findByIdAndUpdate(userId, {
        passwordResetToken: token,
        passwordResetExpires: resetExpires,
      })
      .exec();
  }

  async findByResetToken(token: string): Promise<any | null> {
    // Find a user by the provided reset token ensuring it's not expired
    return await this.userModel
      .findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() }, // Check if token is not expired
      })
      .exec();
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    // Hash the new password before updating it in the user document
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel
      .findByIdAndUpdate(userId, { password: hashedPassword })
      .exec();
  }

  async clearResetToken(userId: string): Promise<void> {
    // Clear/reset the password reset token and expiry for a user
    await this.userModel
      .findByIdAndUpdate(userId, {
        passwordResetToken: null,
        passwordResetExpires: null,
      })
      .exec();
  }

  async updateVerifyToken(
    email: string,
    token: string,
    resetExpires: Date,
  ): Promise<void> {
    try {
      // Find the user by email
      const user = await this.userModel.findOne({ email }).exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Update the user document with the new reset token and expiry date
      await this.userModel
        .findByIdAndUpdate(user._id, {
          verificationOTP: token,
          passwordResetExpires: resetExpires,
        })
        .exec();
    } catch (error) {
      // Handle errors here as needed
      throw new InternalServerErrorException('Error updating token');
    }
  }

  async findByVerifyToken(token: string): Promise<any | null> {
    // Find a user by the provided reset token ensuring it's not expired
    return await this.userModel
      .findOne({
        verificationOTP: token,
        passwordResetExpires: { $gt: new Date() }, // Check if token is not expired
      })
      .exec();
  }

  async isEmailVerified(id: string): Promise<any> {
    await this.userModel
      .findByIdAndUpdate(id, {
        isEmailVarified: true,
        verificationOTP: null,
        passwordResetExpires: null,
      })
      .exec();
  }

  async findByGoogleId(googleId: string): Promise<any | null> {
    return this.userModel.findOne({ googleId }).exec();
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}
