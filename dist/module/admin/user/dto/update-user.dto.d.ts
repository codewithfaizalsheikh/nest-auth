import { Status, UserRole } from 'src/config/enviorments';
export declare class UpdateUserDto {
    readonly name: string;
    readonly email: string;
    readonly mobile: string;
    readonly password: string;
    readonly role: UserRole;
    readonly status: Status;
    readonly isEmailVarified: boolean;
    readonly isMobileVarified: boolean;
    readonly verifyToken: string;
    readonly passwordResetToken: string;
    readonly passwordResetExpires: Date;
    readonly profileImage: string;
    readonly address: string;
    readonly googleId: string;
}
