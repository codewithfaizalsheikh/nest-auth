"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStripePaymentDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_stripe_payment_dto_1 = require("./create-stripe-payment.dto");
class UpdateStripePaymentDto extends (0, mapped_types_1.PartialType)(create_stripe_payment_dto_1.CreateStripePaymentDto) {
}
exports.UpdateStripePaymentDto = UpdateStripePaymentDto;
//# sourceMappingURL=update-stripe-payment.dto.js.map