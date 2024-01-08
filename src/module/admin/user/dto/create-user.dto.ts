import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { GlobalVariable, Status, UserRole } from 'src/config/enviorments';

// DTO (Data Transfer Object) used for creating a new user
export class CreateUserDto {
  // Validate that the name field is a string and not empty (mandatory)
  @IsString({ message: 'Name ' + GlobalVariable.MUST_STRING })
  @IsNotEmpty({ message: 'Name ' + GlobalVariable.NOT_EMPTY })
  readonly name: string;

  // Validate that the email field is in the correct email format and not empty (mandatory)
  @IsEmail({}, { message: 'Enter a valid email address' })
  @IsNotEmpty({ message: 'Email ' + GlobalVariable.NOT_EMPTY })
  readonly email: string;

  // Validate that the mobile field is a number and not empty (mandatory)
  @IsOptional()
  @IsString({ message: 'Enter a valid Mobile Number' })
  @Matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, {
    message: 'Enter a valid Mobile Number',
  })
  // @IsNotEmpty({ message: 'Mobile Number ' + GlobalVariable.NOT_EMPTY })
  readonly mobile: string;

  // Validate that the password field is a string, not empty, and has a minimum length of 6 characters (mandatory)
  @IsString({ message: 'Password ' + GlobalVariable.MUST_STRING })
  @IsNotEmpty({ message: 'Password ' + GlobalVariable.NOT_EMPTY })
  @MinLength(6, { message: 'Password should be at least 6 characters long' })
  readonly password: string;

  // Validate that the role field is an optional enum value (optional)
  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid User Role Super Admin/User' })
  @IsNotEmpty({ message: 'Role ' + GlobalVariable.NOT_EMPTY })
  readonly role: UserRole;

  // Validate that the status field is an optional enum value (optional)
  @IsOptional()
  @IsEnum(Status, { message: 'Invalid Status' })
  @IsNotEmpty({ message: 'Status ' + GlobalVariable.NOT_EMPTY })
  readonly status: Status;

  // Indicate that the email verification status is optional
  @IsOptional()
  readonly isEmailVarified: boolean;

  // Indicate that the mobile verification status is optional
  @IsOptional()
  readonly isMobileVarified: boolean;

  @IsOptional()
  readonly verifyToken: string;

  @IsOptional()
  readonly passwordResetToken: string; // For storing reset token

  @IsOptional()
  readonly passwordResetExpires: Date; // For storing token expiration

  @IsOptional()
  readonly googleId: string;
}
