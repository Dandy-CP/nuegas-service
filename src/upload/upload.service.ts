import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { DeleteFileDTO, UploadBodyDTO } from './dto/payload.dto';

@Injectable()
export class UploadService {
  constructor(private supabase: SupabaseService) {}

  async GetFileList(userId: string) {
    return await this.supabase.getFile(userId);
  }

  async UploadFiles(payload: UploadBodyDTO, userId?: string) {
    const { originalName, buffer } = payload.file;
    const fileName = `attachment-${userId}-${Date.now()}-${originalName}`;

    return await this.supabase.uploadFile(fileName, buffer);
  }

  async DeleteFiles(payload: DeleteFileDTO) {
    return await this.supabase.deleteFile(payload.file_name);
  }
}
