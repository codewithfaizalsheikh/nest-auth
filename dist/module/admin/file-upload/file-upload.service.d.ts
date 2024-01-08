/// <reference types="multer" />
import { UserService } from '../user/user.service';
export declare class FileUploadService {
    private userService;
    constructor(userService: UserService);
    uploadFile(file: Express.Multer.File, id: string, uploadDestination: string, uniqueFileName: any): Promise<any>;
}
