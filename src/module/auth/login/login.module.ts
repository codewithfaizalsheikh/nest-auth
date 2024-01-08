import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { UserModule } from 'src/module/admin/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService for environment variables
import { JwtStrategy } from 'src/core/jwt.strategy';
import { CustomLoggerService } from 'src/core/services/custom-logger.service';

import { GoogleStrategy } from 'src/core/google.strategy'; // Import your GoogleStrategy here
import { EmailService } from 'src/core/services/email.service';

@Module({
  imports: [
    ConfigModule, // Include ConfigModule for environment variables
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PassportModule.register({ defaultStrategy: 'google' }), // Register Google strategy
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string | number>('JWT_EXPIRES'),
        },
      }),
    }),
  ],
  controllers: [LoginController],
  providers: [
    LoginService,
    JwtStrategy,
    CustomLoggerService,
    GoogleStrategy, // Add GoogleStrategy to providers
    EmailService,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class LoginModule {}
