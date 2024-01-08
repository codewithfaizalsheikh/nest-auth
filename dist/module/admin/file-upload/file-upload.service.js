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
exports.FileUploadService = void 0;
const common_1 = require("@nestjs/common");
const path = require("path");
const fs = require("fs");
const user_service_1 = require("../user/user.service");
let FileUploadService = class FileUploadService {
    constructor(userService) {
        this.userService = userService;
    }
    async uploadFile(file, id, uploadDestination, uniqueFileName) {
        try {
            const common_public = './public';
            const destination = path.join(common_public, uploadDestination);
            if (!fs.existsSync(destination)) {
                fs.mkdirSync(destination, { recursive: true });
            }
            await fs.promises.writeFile(path.join(destination, uniqueFileName), file.buffer);
            const fileDetails = {
                originalName: file.originalname,
                fileName: uniqueFileName,
                filePath: path.join(destination, uniqueFileName),
            };
            return { fileDetails };
        }
        catch (error) {
            console.log(error);
            throw new Error('Failed to upload file');
        }
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], FileUploadService);
//# sourceMappingURL=file-upload.service.js.map