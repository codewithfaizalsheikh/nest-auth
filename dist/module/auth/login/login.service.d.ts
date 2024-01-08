import { CreateLoginDto } from './dto/create-login.dto';
import { UserService } from 'src/module/admin/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CustomLoggerService } from 'src/core/services/custom-logger.service';
export declare class LoginService {
    private readonly userService;
    private readonly jwtService;
    private readonly logger;
    private blacklistedTokens;
    constructor(userService: UserService, jwtService: JwtService, logger: CustomLoggerService);
    login(loginDto: CreateLoginDto): Promise<any>;
    saveUserToDatabase(profile: any): Promise<any>;
    googleLogin(user: any): Promise<any>;
    getGoogleData(req: any): Promise<"No user from google" | {
        status: number;
        user: any;
    }>;
    saveGoogleData(user_data: any): Promise<any>;
}
