import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [NestjsFormDataModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
