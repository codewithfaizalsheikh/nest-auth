/// <reference types="multer" />
import { FileUploadService } from './file-upload.service';
export declare class FileUploadController {
    private readonly fileUploadService;
    constructor(fileUploadService: FileUploadService);
    uploadFile1(): Promise<string>;
    uploadFile(file: Express.Multer.File, id: string): Promise<any>;
}
