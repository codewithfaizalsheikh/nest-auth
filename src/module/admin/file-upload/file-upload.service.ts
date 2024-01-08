import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { UserService } from '../user/user.service';

@Injectable()
export class FileUploadService {
  constructor(private userService: UserService) {}

  async uploadFile(
    file: Express.Multer.File,
    id: string,
    uploadDestination: string,
    uniqueFileName,
  ): Promise<any> {
    try {
      const common_public = './public';

      const destination = path.join(common_public, uploadDestination); // Your desired upload directory
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }
      // Save file to the local file system
      await fs.promises.writeFile(
        path.join(destination, uniqueFileName),
        file.buffer,
      );

      // Save file details to MongoDB
      const fileDetails = {
        originalName: file.originalname,
        fileName: uniqueFileName,
        filePath: path.join(destination, uniqueFileName),
      };

      // const user = await this.userService.findById(id);
      // if (user) {
      //   const oldFilePath = user.profileImage; // Get the old file path
      //   if (oldFilePath) {
      //     // Delete the old file if it exists
      //     await fs.promises.unlink(oldFilePath);
      //   }
      //   user.profileImage = fileDetails.filePath;
      //   await user.save();
      // } else {
      //   throw new Error('User not found');
      // }

      return { fileDetails };
    } catch (error) {
      console.log(error);
      throw new Error('Failed to upload file');
    }
  }
}
