import { Controller, Post, Body, Res, Get, Param } from '@nestjs/common';
import { StripePaymentService } from './stripe-payment.service';
import Stripe from 'stripe';
@Controller('stripe-payment')
export class StripePaymentController {
  constructor(private readonly stripePaymentService: StripePaymentService) {}

  @Get('create-checkout-session')
  async createCheckoutSession(@Res() res: any, @Body() customer: any) {
    try {
      // const price = customer.price * 100;
      // const email = customer.email;
      // const name = customer.name;
      // const phone = customer.phone;
      const price = 1 * 100;
      const email = 'fs@mailinator.com';
      const name = 'faizal';
      const phone = '6266878392';
      console.log(1);
      const session = await this.stripePaymentService.createCheckoutSession(
        price,
        email,
        name,
        phone,
      );
      res.redirect(303, session.url);
    } catch (error) {
      // Handle the error here
      console.log(2);
      console.error('Error in creating checkout session:', error);
      // You can send an error response or redirect to an error page
      res.status(500).send('Internal Server Error');
      // You might want to log the error or handle it differently based on your application's requirements
    }
  }

  @Get('get-stripe-customer')
  async getAllCustomers(): Promise<Stripe.ApiList<Stripe.Customer>> {
    return this.stripePaymentService.getAllCustomers();
  }

  @Get(':customerId/transactions')
  async getCustomerTransactions(
    @Param('customerId') customerId: string,
  ): Promise<Stripe.ApiList<Stripe.PaymentIntent>> {
    return this.stripePaymentService.getCustomerTransactions(customerId);
  }

  @Get('create-portal-session')
  async createPortalSession(
    @Body('session_id') sessionId: string,
  ): Promise<string> {
    return this.stripePaymentService.createPortalSession(sessionId);
  }
}
