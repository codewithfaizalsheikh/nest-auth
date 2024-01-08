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
exports.StripePaymentService = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = require("stripe");
let StripePaymentService = class StripePaymentService {
    constructor() {
        this.stripe = new stripe_1.default('sk_test_51OPKc9SF7tc4hj9F0N2Fg4r3Pgkhy43QvtDxiWGU9n6MtBqF6hffBhA4zuWTZQBwA2yAEIpOISAF1tNOhQpxFhpL00UjuKfI1q', {
            apiVersion: '2023-10-16',
        });
    }
    async createCheckoutSession(price, email, name, phone) {
        console.log(3);
        const maxRetries = 3;
        let retries = 0;
        while (retries < maxRetries) {
            try {
                console.log(4);
                const customersResponse = await this.stripe.customers.list({ email: email, limit: 1 });
                let customer;
                if (customersResponse.data.length === 0) {
                    customer = await this.stripe.customers.create({
                        email: email,
                        name: name,
                        phone: phone,
                    });
                }
                else {
                    console.log(5);
                    customer = customersResponse.data[0];
                }
                const session = await this.stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    phone_number_collection: { enabled: true },
                    shipping_address_collection: {
                        allowed_countries: ['US', 'IN'],
                    },
                    line_items: [
                        {
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: 'Sample Product',
                                    description: 'This is a sample product.',
                                    images: ['https://unsplash.com/collections/20876358/random'],
                                },
                                unit_amount: price,
                            },
                            quantity: 1,
                        },
                    ],
                    mode: 'payment',
                    success_url: 'https://api-saaskit.imenso.in/',
                    cancel_url: 'https://api-saaskit.imenso.in/',
                    customer: customer.id,
                    billing_address_collection: 'required',
                    metadata: {
                        india_exports: 'true',
                    },
                    expand: ['customer', 'invoice.subscription'],
                });
                return session;
            }
            catch (error) {
                console.log(error);
                retries++;
                if (retries === maxRetries) {
                    throw new Error(`Failed to create checkout session after ${maxRetries} retries: ${error.message}`);
                }
                throw new Error(`Failed to create checkout session: ${error.message}`);
            }
        }
    }
    async createPortalSession(sessionId) {
        try {
            const checkoutSession = await this.stripe.checkout.sessions.retrieve(sessionId);
            const customerId = checkoutSession.customer;
            const portalSession = await this.stripe.billingPortal.sessions.create({
                customer: customerId,
                return_url: 'https://api-saaskit.imenso.in/plan',
            });
            return portalSession.url;
        }
        catch (error) {
            throw new Error(`Failed to create portal session: ${error.message}`);
        }
    }
    async getAllCustomers() {
        const customers = await this.stripe.customers.list();
        return customers;
    }
    async getCustomerTransactions(customerId) {
        const transactions = await this.stripe.paymentIntents.list({
            customer: customerId,
        });
        return transactions;
    }
};
exports.StripePaymentService = StripePaymentService;
exports.StripePaymentService = StripePaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StripePaymentService);
//# sourceMappingURL=stripe-payment.service.js.map