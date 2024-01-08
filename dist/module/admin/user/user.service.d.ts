/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { CustomLoggerService } from 'src/core/services/custom-logger.service';
import { EmailService } from 'src/core/services/email.service';
export declare class UserService {
    private userModel;
    private readonly logger;
    private readonly emailService;
    constructor(userModel: Model<User>, logger: CustomLoggerService, emailService: EmailService);
    checkEmailExists(email: string): Promise<any>;
    create(createUserDto: CreateUserDto): Promise<any>;
    findAll(): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    profile_image_upload(id: any, file: any, uniqueFileName: any): Promise<string>;
    remove(id: string): Promise<any>;
    findById(_id: string): Promise<any | null>;
    findByEmail(email: string): Promise<any | null>;
    findByMobile(mobile: any): Promise<any | null>;
    updateResetToken(userId: string, token: string, resetExpires: Date): Promise<void>;
    findByResetToken(token: string): Promise<any | null>;
    updatePassword(userId: string, newPassword: string): Promise<void>;
    clearResetToken(userId: string): Promise<void>;
    updateVerifyToken(email: string, token: string, resetExpires: Date): Promise<void>;
    findByVerifyToken(token: string): Promise<any | null>;
    isEmailVerified(id: string): Promise<any>;
    findByGoogleId(googleId: string): Promise<any | null>;
    googleLogin(req: any): "No user from google" | {
        message: string;
        user: any;
    };
}
