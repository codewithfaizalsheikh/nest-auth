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
exports.CreatePlanDto = void 0;
const class_validator_1 = require("class-validator");
const enviorments_1 = require("../../../../config/enviorments");
class CreatePlanDto {
}
exports.CreatePlanDto = CreatePlanDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Name ' + enviorments_1.GlobalVariable.NOT_EMPTY }),
    (0, class_validator_1.IsString)({ message: 'Name ' + enviorments_1.GlobalVariable.MUST_STRING }),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Price ' + enviorments_1.GlobalVariable.NOT_EMPTY }),
    (0, class_validator_1.IsNumber)({}, { message: 'Price ' + enviorments_1.GlobalVariable.MUST_NUMBER }),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'description ' + enviorments_1.GlobalVariable.NOT_EMPTY }),
    (0, class_validator_1.IsString)({ message: 'description ' + enviorments_1.GlobalVariable.MUST_NUMBER }),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Quaterly Price ' + enviorments_1.GlobalVariable.NOT_EMPTY }),
    (0, class_validator_1.IsNumber)({}, { message: 'Quaterly Price ' + enviorments_1.GlobalVariable.MUST_NUMBER }),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "quaterly_price", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Annual Price ' + enviorments_1.GlobalVariable.NOT_EMPTY }),
    (0, class_validator_1.IsNumber)({}, { message: 'Annual Price ' + enviorments_1.GlobalVariable.MUST_NUMBER }),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "annual_price", void 0);
//# sourceMappingURL=create-plan.dto.js.map