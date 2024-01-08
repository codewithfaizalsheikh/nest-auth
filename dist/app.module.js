"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./module/admin/user/user.module");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const login_module_1 = require("./module/auth/login/login.module");
const custom_logger_service_1 = require("./core/services/custom-logger.service");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const file_upload_module_1 = require("./module/admin/file-upload/file-upload.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const plan_module_1 = require("./module/admin/plan/plan.module");
const stripe_payment_module_1 = require("./module/auth/stripe-payment/stripe-payment.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: config.get('JWT_EXPIRES'),
                    },
                }),
            }),
            mongoose_1.MongooseModule.forRoot(process.env.DB_URI),
            login_module_1.LoginModule,
            file_upload_module_1.FileUploadModule,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'public'),
            }),
            plan_module_1.PlanModule,
            stripe_payment_module_1.StripePaymentModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, custom_logger_service_1.CustomLoggerService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map