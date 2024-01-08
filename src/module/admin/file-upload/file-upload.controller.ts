import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  // UploadedFile,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

// import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '../file',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async uploadFile1() {
    return 'file uploades success';
  }

  @Post('profile-img-upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ): Promise<any> {
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const destination = './public/img/user';
    return await this.fileUploadService.uploadFile(
      file,
      id,
      destination,
      uniqueFileName,
    );
  }
}
