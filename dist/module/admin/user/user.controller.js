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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
const file_upload_service_1 = require("../file-upload/file-upload.service");
const path = require("path");
const uuid_1 = require("uuid");
let UserController = class UserController {
    constructor(userService, fileUploadService) {
        this.userService = userService;
        this.fileUploadService = fileUploadService;
    }
    create(createUserDto) {
        return this.userService.create(createUserDto);
    }
    async getAll() {
        try {
            const users = await this.userService.findAll();
            return { users };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to fetch users',
                error,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR, { cause: error });
        }
    }
    async findOne(id) {
        try {
            const user = await this.userService.findById(id);
            return user;
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to find user',
                error,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR, { cause: error });
        }
    }
    async update(id, updateUserDto) {
        try {
            const result = await this.userService.update(id, updateUserDto);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to update user',
                error,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR, { cause: error });
        }
    }
    async remove(id) {
        try {
            const result = await this.userService.remove(id);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to remove user',
                error,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR, { cause: error });
        }
    }
    async uploadFile(file, id) {
        const uniqueFileName = `${(0, uuid_1.v4)()}${path.extname(file.originalname)}`;
        const destination = `/img/user/${id}`;
        const file_upload_path = await this.fileUploadService.uploadFile(file, id, destination, uniqueFileName);
        const file_name = await this.userService.profile_image_upload(id, file, uniqueFileName);
        return { file_name, file_upload_path };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('profile-img-upload/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadFile", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        file_upload_service_1.FileUploadService])
], UserController);
//# sourceMappingURL=user.controller.js.map