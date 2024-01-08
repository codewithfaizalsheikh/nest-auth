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
exports.FileUploadController = void 0;
const common_1 = require("@nestjs/common");
const file_upload_service_1 = require("./file-upload.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path = require("path");
const uuid_1 = require("uuid");
let FileUploadController = class FileUploadController {
    constructor(fileUploadService) {
        this.fileUploadService = fileUploadService;
    }
    async uploadFile1() {
        return 'file uploades success';
    }
    async uploadFile(file, id) {
        const uniqueFileName = `${(0, uuid_1.v4)()}${path.extname(file.originalname)}`;
        const destination = './public/img/user';
        return await this.fileUploadService.uploadFile(file, id, destination, uniqueFileName);
    }
};
exports.FileUploadController = FileUploadController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: '../file',
            filename: (req, file, cb) => {
                cb(null, `${file.originalname}`);
            },
        }),
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FileUploadController.prototype, "uploadFile1", null);
__decorate([
    (0, common_1.Post)('profile-img-upload/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FileUploadController.prototype, "uploadFile", null);
exports.FileUploadController = FileUploadController = __decorate([
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [file_upload_service_1.FileUploadService])
], FileUploadController);
//# sourceMappingURL=file-upload.controller.js.map