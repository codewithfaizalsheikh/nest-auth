import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private readonly configService;
    private transporter;
    constructor(configService: ConfigService);
    sendEmail(email: string, subject: string, text: string): Promise<void>;
}
