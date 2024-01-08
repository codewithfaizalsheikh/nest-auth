import { IsOptional } from 'class-validator';

export class CreateFileUploadDto {
  @IsOptional()
  readonly profileImage: string; // For storing profileimage
}
