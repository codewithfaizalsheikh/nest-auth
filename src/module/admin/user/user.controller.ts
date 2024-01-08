import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  // UseInterceptors,
  // UploadedFile,
  // UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '../file-upload/file-upload.service';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private fileUploadService: FileUploadService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  // @UseGuards(AuthGuard('google'))
  @UseGuards(AuthGuard('jwt'))
  async getAll(): Promise<{ users: User[] }> {
    try {
      const users = await this.userService.findAll();
      return { users };
    } catch (error) {
      // Throw an HTTP exception if fetching users fails
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to fetch users',
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.findById(id);
      return user;
    } catch (error) {
      // Throw an HTTP exception if user retrieval fails
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to find user',
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  // Endpoint to update a user by ID (requires authentication)
  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const result = await this.userService.update(id, updateUserDto);
      return result;
    } catch (error) {
      // Throw an HTTP exception if user update fails
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update user',
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  // Endpoint to remove a user by ID (requires authentication)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string) {
    try {
      const result = await this.userService.remove(id);
      return result;
    } catch (error) {
      // Throw an HTTP exception if user removal fails
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to remove user',
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @Post('profile-img-upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ): Promise<any> {
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const destination = `/img/user/${id}`;
    const file_upload_path = await this.fileUploadService.uploadFile(
      file,
      id,
      destination,
      uniqueFileName,
    );
    const file_name = await this.userService.profile_image_upload(
      id,
      file,
      uniqueFileName,
    );

    return { file_name, file_upload_path };
  }
}
