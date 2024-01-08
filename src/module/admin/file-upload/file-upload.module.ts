import { Module, forwardRef } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
// import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
