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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const enviorments_1 = require("../../../config/enviorments");
const bcrypt = require("bcryptjs");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_entity_1 = require("./entities/user.entity");
const custom_logger_service_1 = require("../../../core/services/custom-logger.service");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const email_service_1 = require("../../../core/services/email.service");
let UserService = class UserService {
    constructor(userModel, logger, emailService) {
        this.userModel = userModel;
        this.logger = logger;
        this.emailService = emailService;
    }
    async checkEmailExists(email) {
        const user = await this.userModel.findOne({ email }).exec();
        return !!user;
    }
    async create(createUserDto) {
        const { name, email, mobile, password, role, status, isEmailVarified, isMobileVarified, googleId, } = createUserDto;
        try {
            const existingEmailUser = await this.userModel.findOne({ email });
            if (existingEmailUser) {
                throw new common_1.BadRequestException(`Email: ${email} ${enviorments_1.GlobalVariable.EXIST}`);
            }
            const existingMobileUser = await this.userModel.findOne({ mobile });
            if (mobile !== null) {
                if (existingMobileUser) {
                    throw new common_1.BadRequestException(`Mobile: ${mobile} ${enviorments_1.GlobalVariable.EXIST}`);
                }
            }
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
                const resetExpires = new Date(Date.now() + 3600000);
                await this.updateVerifyToken(email, token, resetExpires);
                const subject = 'Verify Email';
                const text = `You are receiving this because you have requested the Verify email for your account.\n\n` +
                    `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                    `https://api-saaskit.imenso.in/auth/email-verify/${token}\n\n` +
                    `If you did not request this, please ignore this email.\n`;
                await this.emailService.sendEmail(createUserDto.email, subject, text);
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: enviorments_1.GlobalVariable.CREATE,
                data: user,
            };
        }
        catch (error) {
            console.log(error);
            let statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            let errorMessage = enviorments_1.GlobalVariable.FAIL;
            const errorArray = [];
            if (error instanceof common_1.UnauthorizedException) {
                statusCode = common_1.HttpStatus.UNAUTHORIZED;
                errorMessage = error.message;
                errorArray.push({ unauthorizedError: error.message });
            }
            else if (error instanceof common_1.BadRequestException) {
                statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorMessage = error.message;
                errorArray.push({ error: error.message });
            }
            else {
                errorArray.push({ error: enviorments_1.GlobalVariable.FAIL });
            }
            const log = this.logger.error(`${enviorments_1.GlobalVariable.LOG_ERROR} creation: ${error}`, error.stack);
            return {
                statusCode: statusCode,
                message: errorMessage,
                error: error.message,
                log,
            };
        }
    }
    async findAll() {
        try {
            const users = await this.userModel.find().exec();
            const totalCount = await this.userModel.countDocuments();
            return {
                statusCode: 200,
                totalCount,
                message: enviorments_1.GlobalVariable.FETCH,
                data: users,
            };
        }
        catch (error) {
            console.log(error);
            const logs = this.logger.error(`${enviorments_1.GlobalVariable.LOG_ERROR} fetch: ${error}`, error.stack);
            return {
                statusCode: 500,
                message: enviorments_1.GlobalVariable.FETCH_FAIL,
                error: error.message,
                logs,
            };
        }
    }
    async update(id, updateUserDto) {
        try {
            const { password, ...rest } = updateUserDto;
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const updatedUser = await this.userModel.findByIdAndUpdate(id, { ...rest, password: hashedPassword }, {
                    new: true,
                    runValidators: true,
                });
                if (!updatedUser) {
                    throw new common_1.NotFoundException(enviorments_1.GlobalVariable.NOT_FOUND);
                }
                return {
                    statusCode: 200,
                    message: enviorments_1.GlobalVariable.UPDATE,
                    data: updatedUser,
                };
            }
            else {
                const updatedUser = await this.userModel.findByIdAndUpdate(id, { ...rest }, {
                    new: true,
                    runValidators: true,
                });
                if (!updatedUser) {
                    throw new common_1.NotFoundException(enviorments_1.GlobalVariable.NOT_FOUND);
                }
                return {
                    statusCode: 200,
                    message: enviorments_1.GlobalVariable.UPDATE,
                    data: updatedUser,
                };
            }
        }
        catch (error) {
            console.log(error);
            const log = this.logger.error(`${enviorments_1.GlobalVariable.LOG_ERROR} update: ${error}`, error.stack);
            let statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            if (error instanceof common_1.NotFoundException) {
                statusCode = common_1.HttpStatus.NOT_FOUND;
            }
            return {
                statusCode,
                message: enviorments_1.GlobalVariable.UPDATE_FAIL,
                error: error.message,
                log,
            };
        }
    }
    async profile_image_upload(id, file, uniqueFileName) {
        const user = await this.userModel.findById(id);
        if (user) {
            const destination = `/img/user/${id}`;
            const oldFilePath = './public/' + user.profileImage;
            if (oldFilePath && fs.existsSync(oldFilePath)) {
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
        }
        else {
            throw new Error('User not found');
        }
    }
    async remove(id) {
        try {
            const deletedUser = await this.userModel.findByIdAndDelete(id);
            if (!deletedUser) {
                throw new common_1.NotFoundException(enviorments_1.GlobalVariable.NOT_FOUND);
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: enviorments_1.GlobalVariable.DELETE_SUCCESS,
                data: deletedUser,
            };
        }
        catch (error) {
            console.log(error);
            const log = this.logger.error(`${enviorments_1.GlobalVariable.LOG_ERROR} reset: ${error}`, error.stack);
            let statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            if (error instanceof common_1.NotFoundException) {
                statusCode = common_1.HttpStatus.NOT_FOUND;
            }
            return {
                statusCode,
                message: enviorments_1.GlobalVariable.DELETE_FAIL,
                error: error.message,
                log,
            };
        }
    }
    async findById(_id) {
        try {
            return this.userModel.findById({ _id }).exec();
        }
        catch (error) {
            console.log(error);
            const log = this.logger.error(`${enviorments_1.GlobalVariable.LOG_ERROR} fetch: ${error}`, error.stack);
            return {
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: enviorments_1.GlobalVariable.FETCH_FAIL,
                error: error.message,
                log,
            };
        }
    }
    async findByEmail(email) {
        try {
            return this.userModel.findOne({ email }).exec();
        }
        catch (error) {
            console.log(error);
            return {
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: enviorments_1.GlobalVariable.FETCH_FAIL,
                error: error.message,
            };
        }
    }
    async findByMobile(mobile) {
        try {
            return this.userModel.findOne({ mobile }).exec();
        }
        catch (error) {
            console.log(error);
            return {
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: enviorments_1.GlobalVariable.FETCH_FAIL,
                error: error.message,
            };
        }
    }
    async updateResetToken(userId, token, resetExpires) {
        await this.userModel
            .findByIdAndUpdate(userId, {
            passwordResetToken: token,
            passwordResetExpires: resetExpires,
        })
            .exec();
    }
    async findByResetToken(token) {
        return await this.userModel
            .findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: new Date() },
        })
            .exec();
    }
    async updatePassword(userId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userModel
            .findByIdAndUpdate(userId, { password: hashedPassword })
            .exec();
    }
    async clearResetToken(userId) {
        await this.userModel
            .findByIdAndUpdate(userId, {
            passwordResetToken: null,
            passwordResetExpires: null,
        })
            .exec();
    }
    async updateVerifyToken(email, token, resetExpires) {
        try {
            const user = await this.userModel.findOne({ email }).exec();
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            await this.userModel
                .findByIdAndUpdate(user._id, {
                verificationOTP: token,
                passwordResetExpires: resetExpires,
            })
                .exec();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error updating token');
        }
    }
    async findByVerifyToken(token) {
        return await this.userModel
            .findOne({
            verificationOTP: token,
            passwordResetExpires: { $gt: new Date() },
        })
            .exec();
    }
    async isEmailVerified(id) {
        await this.userModel
            .findByIdAndUpdate(id, {
            isEmailVarified: true,
            verificationOTP: null,
            passwordResetExpires: null,
        })
            .exec();
    }
    async findByGoogleId(googleId) {
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
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        custom_logger_service_1.CustomLoggerService,
        email_service_1.EmailService])
], UserService);
//# sourceMappingURL=user.service.js.map