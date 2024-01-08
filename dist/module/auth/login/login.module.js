"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginModule = void 0;
const common_1 = require("@nestjs/common");
const login_service_1 = require("./login.service");
const login_controller_1 = require("./login.controller");
const user_module_1 = require("../../admin/user/user.module");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const jwt_strategy_1 = require("../../../core/jwt.strategy");
const custom_logger_service_1 = require("../../../core/services/custom-logger.service");
const google_strategy_1 = require("../../../core/google.strategy");
const email_service_1 = require("../../../core/services/email.service");
let LoginModule = class LoginModule {
};
exports.LoginModule = LoginModule;
exports.LoginModule = LoginModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            user_module_1.UserModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            passport_1.PassportModule.register({ defaultStrategy: 'google' }),
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: config.get('JWT_EXPIRES'),
                    },
                }),
            }),
        ],
        controllers: [login_controller_1.LoginController],
        providers: [
            login_service_1.LoginService,
            jwt_strategy_1.JwtStrategy,
            custom_logger_service_1.CustomLoggerService,
            google_strategy_1.GoogleStrategy,
            email_service_1.EmailService,
        ],
        exports: [jwt_strategy_1.JwtStrategy, passport_1.PassportModule],
    })
], LoginModule);
//# sourceMappingURL=login.module.js.map