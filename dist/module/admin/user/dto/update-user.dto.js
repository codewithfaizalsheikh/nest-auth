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
exports.UpdateUserDto = void 0;
const class_validator_1 = require("class-validator");
const enviorments_1 = require("../../../../config/enviorments");
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Name ' + enviorments_1.GlobalVariable.MUST_STRING }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Name ' + enviorments_1.GlobalVariable.NOT_EMPTY }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Enter a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email ' + enviorments_1.GlobalVariable.NOT_EMPTY }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Enter a valid Mobile Number' }),
    (0, class_validator_1.Matches)(/^(\+\d{1,3}[- ]?)?\d{10}$/, {
        message: 'Enter a valid Mobile Number',
    }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "mobile", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Password ' + enviorments_1.GlobalVariable.MUST_STRING }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password ' + enviorments_1.GlobalVariable.NOT_EMPTY }),
    (0, class_validator_1.MinLength)(6, { message: 'Password should be at least 6 characters long' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Role ' + enviorments_1.GlobalVariable.MUST_STRING }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Role ' + enviorments_1.GlobalVariable.NOT_EMPTY }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Status ' + enviorments_1.GlobalVariable.MUST_STRING }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Status ' + enviorments_1.GlobalVariable.NOT_EMPTY }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isEmailVarified", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isMobileVarified", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "verifyToken", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "passwordResetToken", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateUserDto.prototype, "passwordResetExpires", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "profileImage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "googleId", void 0);
//# sourceMappingURL=update-user.dto.js.map