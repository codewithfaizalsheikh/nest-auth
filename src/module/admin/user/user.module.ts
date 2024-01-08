import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { CustomLoggerService } from 'src/core/services/custom-logger.service';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { EmailService } from 'src/core/services/email.service';

// Module responsible for managing user-related functionalities
@Module({
  // Importing the User model into the MongooseModule for feature usage
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    forwardRef(() => FileUploadModule),
  ],
  controllers: [UserController], // Controllers handling user-related HTTP requests
  providers: [UserService, User, CustomLoggerService, EmailService], // Services and entities used within the module
  exports: [UserService, User], // Making UserService and User available for other modules that import UserModule
})
export class UserModule {}
