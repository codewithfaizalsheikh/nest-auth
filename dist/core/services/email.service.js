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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASS'),
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }
    async sendEmail(email, subject, text) {
        try {
            const senderEmail = this.configService.get('EMAIL_USER');
            if (!senderEmail) {
                throw new Error('Sender email not found in configuration');
            }
            const mailOptions = {
                from: `"Faizal sheikh" <${senderEmail}>`,
                to: email,
                subject,
                text,
            };
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.log(error);
            throw new Error('Failed to send email');
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map