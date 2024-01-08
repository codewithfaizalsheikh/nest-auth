import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { GlobalVariable } from 'src/config/enviorments';

export class CreateLoginDto {
  // Validate that the email field is in the correct email format if provided
  @IsOptional()
  @IsEmail({}, { message: 'Enter a valid email address' })
  readonly email: string;

  // Validate that the mobile field is a string and matches a specific format if provided
  @IsOptional()
  @IsString({ message: 'Mobile ' + GlobalVariable.MUST_NUMBER })
  @Matches(/^[0-9]+$/, { message: 'Mobile ' + GlobalVariable.MUST_NUMBER })
  readonly mobile: number;

  // Validate that either email or mobile is present
  @ValidateIf((o) => !o.email && !o.mobile)
  readonly emailOrMobile: string;

  // Validate that the password field is a string, not empty, and has a minimum length of 6 characters
  @IsString({ message: 'Password ' + GlobalVariable.MUST_STRING })
  @IsNotEmpty({ message: 'Password ' + GlobalVariable.NOT_EMPTY })
  @MinLength(6, { message: 'Password should be at least 6 characters long' })
  readonly password: string;
}
