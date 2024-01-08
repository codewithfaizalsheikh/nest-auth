import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/admin/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Config module for environment variables
import { LoginModule } from './module/auth/login/login.module';
import { CustomLoggerService } from './core/services/custom-logger.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { FileUploadModule } from './module/admin/file-upload/file-upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PlanModule } from './module/admin/plan/plan.module';
import { StripePaymentModule } from './module/auth/stripe-payment/stripe-payment.module';

@Module({
  imports: [
    UserModule,
    // Import and configure ConfigModule for handling environment variables
    ConfigModule.forRoot({
      envFilePath: '.env', // Path to the environment file
      isGlobal: true, // Make the configuration available globally
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string | number>('JWT_EXPIRES'),
        },
      }),
    }),
    // Import and configure MongooseModule to establish a connection with the database
    MongooseModule.forRoot(process.env.DB_URI),
    LoginModule,

    FileUploadModule, // Use the DB_URI from environment variables
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    PlanModule,
    StripePaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService, CustomLoggerService],
})
export class AppModule {}
