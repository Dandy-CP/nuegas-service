import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { UploadService } from './upload.service';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { JWTPayloadUser } from 'src/auth/types/auth.type';
import { DeleteFileDTO, UploadBodyDTO } from './dto/payload.dto';

@Controller('files')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('/list')
  GetFilesList(@GetUser() user: JWTPayloadUser) {
    return this.uploadService.GetFileList(user.user_id);
  }

  @Post('/upload')
  @FormDataRequest()
  UploadFile(@Body() payload: UploadBodyDTO, @GetUser() user: JWTPayloadUser) {
    return this.uploadService.UploadFiles(payload, user.user_id);
  }

  @Delete('/delete')
  DeleteFile(@Body() payload: DeleteFileDTO) {
    return this.uploadService.DeleteFiles(payload);
  }
}
