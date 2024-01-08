import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GlobalVariable, Status, UserRole } from 'src/config/enviorments';

// Define a schema for the 'User' entity using Mongoose
@Schema({
  timestamps: true, // Automatically manage 'createdAt' and 'updatedAt' timestamps
})
export class User {
  @Prop()
  name: string; // User's name

  @Prop({ unique: [true, GlobalVariable.EXIST] })
  email: string; // User's email, unique constraint applied

  @Prop()
  mobile: string | null; // User's mobile number, unique constraint applied

  @Prop()
  password: string; // User's password

  @Prop({ default: UserRole.USER }) // Set default role to 'user'
  role: string; // User's role, defaults to 'user'

  @Prop({ default: Status.INACTIVE }) // Set default status to 'inactive'
  status: string; // User's status, defaults to 'inactive'

  @Prop({ default: false }) // Set default value of isEmailVarified to false
  isEmailVarified: boolean; // Indicates if user's email is verified

  @Prop({ default: false }) // Set default value of isMobileVarified to false
  isMobileVarified: boolean; // Indicates if user's mobile is verified

  @Prop()
  passwordResetToken: string | null; // For storing reset token

  @Prop()
  passwordResetExpires: Date | null; // For storing token expiration

  @Prop()
  verificationOTP: string; // For storing verification OTP

  @Prop()
  verifyToken: string;

  @Prop()
  profileImage: string;

  @Prop()
  address: string;

  @Prop()
  googleId: string;
}

// Create a Mongoose schema based on the User class
export const UserSchema = SchemaFactory.createForClass(User);
