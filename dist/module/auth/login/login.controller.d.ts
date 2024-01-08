import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { UserService } from 'src/module/admin/user/user.service';
import { EmailService } from 'src/core/services/email.service';
import { JwtService } from '@nestjs/jwt';
export declare class LoginController {
    private loginService;
    private userService;
    private readonly emailService;
    private jwtService;
    constructor(loginService: LoginService, userService: UserService, emailService: EmailService, jwtService: JwtService);
    login(loginDto: CreateLoginDto): Promise<{
        token: string;
    }>;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<string>;
    googleLogin(token: string): Promise<any>;
    checkEmail(email: string): Promise<any>;
    forgotPassword(body: {
        email: string;
    }): Promise<{
        message: string;
        token?: undefined;
    } | {
        message: string;
        token: string;
    }>;
    resetPassword(token: string, body: {
        password: string;
    }): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    reSendVerifyEmail(body: {
        email: string;
    }): Promise<{
        message: string;
        token?: undefined;
    } | {
        message: string;
        token: string;
    }>;
}
