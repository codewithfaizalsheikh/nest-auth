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
exports.StripePaymentController = void 0;
const common_1 = require("@nestjs/common");
const stripe_payment_service_1 = require("./stripe-payment.service");
let StripePaymentController = class StripePaymentController {
    constructor(stripePaymentService) {
        this.stripePaymentService = stripePaymentService;
    }
    async createCheckoutSession(res, customer) {
        try {
            const price = 1 * 100;
            const email = 'fs@mailinator.com';
            const name = 'faizal';
            const phone = '6266878392';
            console.log(1);
            const session = await this.stripePaymentService.createCheckoutSession(price, email, name, phone);
            res.redirect(303, session.url);
        }
        catch (error) {
            console.log(2);
            console.error('Error in creating checkout session:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    async getAllCustomers() {
        return this.stripePaymentService.getAllCustomers();
    }
    async getCustomerTransactions(customerId) {
        return this.stripePaymentService.getCustomerTransactions(customerId);
    }
    async createPortalSession(sessionId) {
        return this.stripePaymentService.createPortalSession(sessionId);
    }
};
exports.StripePaymentController = StripePaymentController;
__decorate([
    (0, common_1.Get)('create-checkout-session'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StripePaymentController.prototype, "createCheckoutSession", null);
__decorate([
    (0, common_1.Get)('get-stripe-customer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StripePaymentController.prototype, "getAllCustomers", null);
__decorate([
    (0, common_1.Get)(':customerId/transactions'),
    __param(0, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StripePaymentController.prototype, "getCustomerTransactions", null);
__decorate([
    (0, common_1.Get)('create-portal-session'),
    __param(0, (0, common_1.Body)('session_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StripePaymentController.prototype, "createPortalSession", null);
exports.StripePaymentController = StripePaymentController = __decorate([
    (0, common_1.Controller)('stripe-payment'),
    __metadata("design:paramtypes", [stripe_payment_service_1.StripePaymentService])
], StripePaymentController);
//# sourceMappingURL=stripe-payment.controller.js.map