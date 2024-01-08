/// <reference types="multer" />
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FileUploadService } from '../file-upload/file-upload.service';
export declare class UserController {
    private userService;
    private fileUploadService;
    constructor(userService: UserService, fileUploadService: FileUploadService);
    create(createUserDto: CreateUserDto): Promise<any>;
    getAll(): Promise<{
        users: User[];
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    remove(id: string): Promise<any>;
    uploadFile(file: Express.Multer.File, id: string): Promise<any>;
}
