import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripePaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(
      'sk_test_51OPKc9SF7tc4hj9F0N2Fg4r3Pgkhy43QvtDxiWGU9n6MtBqF6hffBhA4zuWTZQBwA2yAEIpOISAF1tNOhQpxFhpL00UjuKfI1q',
      {
        apiVersion: '2023-10-16',
      },
    );
  }

  async createCheckoutSession(price, email, name, phone): Promise<any> {
    console.log(3);
    const maxRetries = 3;
    let retries = 0;
    while (retries < maxRetries) {
      try {
        console.log(4);
        const customersResponse: Stripe.ApiList<Stripe.Customer> =
          await this.stripe.customers.list({ email: email, limit: 1 });

        let customer: Stripe.Customer;

        if (customersResponse.data.length === 0) {
          // Customer doesn't exist, create a new one
          customer = await this.stripe.customers.create({
            email: email,
            name: name,
            phone: phone,
            // Add address if needed
          });
        } else {
          // Customer exists, use the first found customer
          console.log(5);
          customer = customersResponse.data[0];
        }

        const session = await this.stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          phone_number_collection: { enabled: true },
          shipping_address_collection: {
            // Add shipping address collection
            allowed_countries: ['US', 'IN'], // Define allowed shipping countries if needed
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
                unit_amount: price, // Representing $20.00 in cents
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: 'https://api-saaskit.imenso.in/', // Replace with your success URL
          cancel_url: 'https://api-saaskit.imenso.in/', // Replace with your cancel URL
          customer: customer.id,
          billing_address_collection: 'required', // Specify billing address collection
          metadata: {
            india_exports: 'true', // Additional metadata indicating non-INR transaction
          },
          // allowed_countries: ['US'],
          expand: ['customer', 'invoice.subscription'],
          // consent_collection: {
          //   terms_of_service: 'required',
          // },
        });

        return session;
      } catch (error) {
        console.log(error);
        retries++;
        if (retries === maxRetries) {
          throw new Error(
            `Failed to create checkout session after ${maxRetries} retries: ${error.message}`,
          );
        }
        throw new Error(`Failed to create checkout session: ${error.message}`);
      }
    }
  }

  async createPortalSession(sessionId: string): Promise<string> {
    try {
      const checkoutSession =
        await this.stripe.checkout.sessions.retrieve(sessionId);

      // Extract the customer ID as a string
      const customerId = checkoutSession.customer as string;

      const portalSession = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: 'https://api-saaskit.imenso.in/plan',
      });

      return portalSession.url;
    } catch (error) {
      throw new Error(`Failed to create portal session: ${error.message}`);
    }
  }

  async getAllCustomers(): Promise<Stripe.ApiList<Stripe.Customer>> {
    const customers = await this.stripe.customers.list(); // Example: Limiting to 10 customers
    return customers;
  }

  async getCustomerTransactions(
    customerId: string,
  ): Promise<Stripe.ApiList<Stripe.PaymentIntent>> {
    const transactions = await this.stripe.paymentIntents.list({
      customer: customerId,
    });
    return transactions;
  }
}
