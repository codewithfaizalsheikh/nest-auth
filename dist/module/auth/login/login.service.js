"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../../admin/user/user.service");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
const custom_logger_service_1 = require("../../../core/services/custom-logger.service");
const enviorments_1 = require("../../../config/enviorments");
let LoginService = class LoginService {
    constructor(userService, jwtService, logger) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.logger = logger;
        this.blacklistedTokens = new Set();
    }
    async login(loginDto) {
        try {
            const { email, password, mobile } = loginDto;
            let user;
            if (!email && !mobile) {
                throw new common_1.BadRequestException(`${enviorments_1.GlobalVariable.BLANK_EMAIL_MOBILE}`);
            }
            if (email) {
                user = await this.userService.findByEmail(email);
            }
            else {
                user = await this.userService.findByMobile(mobile);
            }
            if (!user) {
                const errorMessage = email
                    ? 'Invalid email or email not found'
                    : ' Invalid mobile number or mobile number not found';
                throw new common_1.UnauthorizedException(errorMessage);
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                throw new common_1.UnauthorizedException(enviorments_1.GlobalVariable.INCORECT);
            }
            if (!user.isEmailVarified) {
                throw new common_1.UnauthorizedException(enviorments_1.GlobalVariable.NOT_VERIFY);
            }
            const token = this.jwtService.sign({ id: user._id });
            return {
                statusCode: common_1.HttpStatus.OK,
                message: enviorments_1.GlobalVariable.LOGIN,
                data: token,
                user,
            };
        }
        catch (error) {
            console.error(error);
            const log = this.logger.error(`${enviorments_1.GlobalVariable.LOG_ERROR} login: ${error}`, error.stack);
            let statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            let errorMessage = enviorments_1.GlobalVariable.FAIL;
            const errorArray = [];
            if (error instanceof common_1.UnauthorizedException) {
                statusCode = common_1.HttpStatus.UNAUTHORIZED;
                errorMessage = error.message;
                errorArray.push({ error: error.message });
            }
            else if (error instanceof common_1.BadRequestException) {
                statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorMessage = error.message;
                errorArray.push({ error: error.message });
            }
            else {
                errorArray.push({ error: enviorments_1.GlobalVariable.FAIL });
            }
            return {
                statusCode,
                message: errorMessage,
                error: errorArray,
                log,
            };
        }
    }
    async saveUserToDatabase(profile) {
        try {
            console.log('save data ');
            const user = await this.userService.findByGoogleId(profile.id);
            if (user) {
                const jwt = await this.googleLogin(user._id);
                return {
                    message: 'User already exists',
                    user: user,
                    token: jwt.access_token,
                };
            }
            else {
                const fullName = profile.displayName || null;
                const googleId = profile.id;
                const newUser = await this.userService.create({
                    email: profile.emails[0].value,
                    mobile: null,
                    password: '',
                    name: fullName,
                    role: enviorments_1.UserRole.USER,
                    status: enviorments_1.Status.INACTIVE,
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
                }
                else {
                    console.log('Failed to create new user');
                    return null;
                }
            }
        }
        catch (error) {
            console.error('Error while creating a new user:', error);
            throw error;
        }
    }
    async googleLogin(user) {
        const userId = user && user._id ? user._id.toString() : null;
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
    async saveGoogleData(user_data) {
        try {
            const user = await this.userService.findByGoogleId(user_data.googleId);
            console.log(1);
            if (user) {
                console.log('User already exists');
                const jwt = await this.googleLogin(user._id);
                return {
                    statusCode: common_1.HttpStatus.OK,
                    message: 'User already exists',
                    user: user,
                    data: jwt.access_token,
                };
            }
            else {
                const newUser = await this.userService.create({
                    email: user_data.email,
                    mobile: null,
                    password: '',
                    name: user_data.name,
                    role: enviorments_1.UserRole.USER,
                    status: enviorments_1.Status.INACTIVE,
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
                        statusCode: common_1.HttpStatus.OK,
                        message: 'New user created',
                        user: newUser,
                        data: jwt.access_token,
                    };
                }
                else {
                    console.log('Failed to create new user');
                    return null;
                }
            }
        }
        catch (error) {
            console.error('Error while creating a new user:', error);
            throw error;
        }
    }
};
exports.LoginService = LoginService;
exports.LoginService = LoginService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        custom_logger_service_1.CustomLoggerService])
], LoginService);
//# sourceMappingURL=login.service.js.map