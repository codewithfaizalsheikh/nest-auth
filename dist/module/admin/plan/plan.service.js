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
exports.PlanService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const plan_entity_1 = require("./entities/plan.entity");
const custom_logger_service_1 = require("../../../core/services/custom-logger.service");
const enviorments_1 = require("../../../config/enviorments");
let PlanService = class PlanService {
    constructor(planModel, logger) {
        this.planModel = planModel;
        this.logger = logger;
    }
    async create(createPlanDto) {
        const { name, price, description, quaterly_price, annual_price } = createPlanDto;
        try {
            const plan = await this.planModel.create({
                name,
                price,
                description,
                quaterly_price,
                annual_price,
            });
            return {
                statusCode: 200,
                message: enviorments_1.GlobalVariable.CREATE,
                data: plan,
            };
        }
        catch (error) {
            console.log(error);
            this.logger.error(`Error occurred during user fetch: ${error}`, error.stack);
            return {
                statusCode: 500,
                message: enviorments_1.GlobalVariable.FETCH_FAIL,
                error: error.message,
            };
        }
    }
    async findAll() {
        try {
            const plan = await this.planModel.find().exec();
            const totatCount = await this.planModel.countDocuments();
            return {
                totatCount,
                statusCode: 200,
                message: enviorments_1.GlobalVariable.FETCH,
                data: plan,
            };
        }
        catch (error) {
            console.log(error);
            this.logger.error(`Error occurred during user fetch: ${error}`, error.stack);
            return {
                statusCode: 500,
                message: enviorments_1.GlobalVariable.CREATE_FAIL,
                error: error.message,
            };
        }
    }
    async update(id, updatePlanDto) {
        try {
            const updatedUser = await this.planModel.findByIdAndUpdate(id, updatePlanDto, {
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
        catch (error) {
            console.log(error);
            this.logger.error(`Error occurred during user fetch: ${error}`, error.stack);
            return {
                statusCode: 500,
                message: enviorments_1.GlobalVariable.UPDATE_FAIL,
                error: error.message,
            };
        }
    }
    async remove(id) {
        try {
            return this.planModel.findByIdAndDelete(id);
        }
        catch (error) {
            console.log(error);
            this.logger.error(`Error occurred during user fetch: ${error}`, error.stack);
            return {
                statusCode: 500,
                message: enviorments_1.GlobalVariable.DELETE_FAIL,
                error: error.message,
            };
        }
    }
    async findById(_id) {
        try {
            return this.planModel.findById({ _id }).exec();
        }
        catch (error) {
            console.log(error);
            this.logger.error(`Error occurred during user fetch: ${error}`, error.stack);
            return {
                statusCode: 500,
                message: enviorments_1.GlobalVariable.FETCH_FAIL,
                error: error.message,
            };
        }
    }
};
exports.PlanService = PlanService;
exports.PlanService = PlanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(plan_entity_1.Plan.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        custom_logger_service_1.CustomLoggerService])
], PlanService);
//# sourceMappingURL=plan.service.js.map