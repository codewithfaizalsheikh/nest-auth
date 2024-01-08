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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const common_1 = require("@nestjs/common");
const login_service_1 = require("./login.service");
const create_login_dto_1 = require("./dto/create-login.dto");
const user_service_1 = require("../../admin/user/user.service");
const crypto = require("crypto");
const enviorments_1 = require("../../../config/enviorments");
const email_service_1 = require("../../../core/services/email.service");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
let LoginController = class LoginController {
    constructor(loginService, userService, emailService, jwtService) {
        this.loginService = loginService;
        this.userService = userService;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        try {
            const result = await this.loginService.login(loginDto);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to login',
                error,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR, { cause: error });
        }
    }
    async googleAuth() { }
    async googleAuthRedirect(req, res) {
        if (!req.user) {
            return 'No user from google';
        }
        res.status(200).json({
            status: 200,
            message: 'Login Successfullqqq',
            user: req.user,
        });
    }
    async googleLogin(token) {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const user_data = {
            googleId: payload.sub,
            email: payload.email,
            name: payload.name,
        };
        return await this.loginService.saveGoogleData(user_data);
    }
    async checkEmail(email) {
        const exists = await this.userService.checkEmailExists(email);
        if (exists === true) {
            return { message: enviorments_1.GlobalVariable.EXIST };
        }
    }
    async forgotPassword(body) {
        const user = await this.userService.findByEmail(body.email);
        if (!user) {
            return { message: 'Email not found' };
        }
        const token = crypto.randomBytes(20).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000);
        await this.userService.updateResetToken(user._id, token, resetExpires);
        const subject = 'Password Reset';
        const text = `You are receiving this because you have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `http://localhost:3000/auth/reset/${token}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`;
        await this.emailService.sendEmail(user.email, subject, text);
        return { message: 'Reset email sent', token };
    }
    async resetPassword(token, body) {
        if (!body.password || body.password.length < 6) {
            throw new common_1.HttpException('Password must be at least 6 characters long', common_1.HttpStatus.UNAUTHORIZED);
        }
        const user = await this.userService.findByResetToken(token);
        if (!user || user.passwordResetExpires < new Date()) {
            throw new common_1.HttpException('Invalid or expired token', common_1.HttpStatus.UNAUTHORIZED);
        }
        await this.userService.updatePassword(user._id, body.password);
        await this.userService.clearResetToken(user._id);
        return { message: 'Password updated successfully' };
    }
    async verifyEmail(token) {
        const user = await this.userService.findByVerifyToken(token);
        if (!user || user.passwordResetExpires < new Date()) {
            return { message: 'Invalid or expired token' };
        }
        await this.userService.isEmailVerified(user._id);
        return { message: 'Email verified successfully' };
    }
    async reSendVerifyEmail(body) {
        try {
            const user = await this.userService.findByEmail(body.email);
            if (!user) {
                return { message: 'Email not found' };
            }
            const token = crypto.randomBytes(20).toString('hex');
            const resetExpires = new Date(Date.now() + 3600000);
            await this.userService.updateVerifyToken(user.email, token, resetExpires);
            const subject = 'Verify Email';
            const text = `You are receiving this because you have requested the Re-Verify email for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `https://api-saaskit.imenso.in/auth/email-verify/${token}\n\n` +
                `If you did not request this, please ignore this email.\n`;
            await this.emailService.sendEmail(user.email, subject, text);
            return { message: 'Verify email sent successfully', token };
        }
        catch (error) {
            console.error(error.message);
            return { message: 'Failed to resend verification email' + error };
        }
    }
};
exports.LoginController = LoginController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_login_dto_1.CreateLoginDto]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('data'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.Post)('google/login'),
    __param(0, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "googleLogin", null);
__decorate([
    (0, common_1.Get)('check-email'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "checkEmail", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password/:token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('email-verify/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('resend-verify-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "reSendVerifyEmail", null);
exports.LoginController = LoginController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        user_service_1.UserService,
        email_service_1.EmailService,
        jwt_1.JwtService])
], LoginController);
//# sourceMappingURL=login.controller.js.map