// email.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',

      port: 465,

      secure: true, // true for 465, false for other ports

      auth: {
        user: this.configService.get<string>('EMAIL_USER'),

        pass: this.configService.get<string>('EMAIL_PASS'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(email: string, subject: string, text: string): Promise<void> {
    try {
      const senderEmail = this.configService.get<string>('EMAIL_USER');

      if (!senderEmail) {
        throw new Error('Sender email not found in configuration');
      }

      const mailOptions = {
        from: `"Faizal sheikh" <${senderEmail}>`, // Replace "Faizal sheikh" with your name
        to: email,
        subject,
        text,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
      throw new Error('Failed to send email');
    }
  }
}
