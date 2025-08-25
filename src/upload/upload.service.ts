import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from '../prisma/prisma.service';
import { DeleteFileDTO, UploadBodyDTO } from './dto/payload.dto';

@Injectable()
export class UploadService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
  ) {}

  async GetFileList(userId: string) {
    return await this.prisma.file.findMany({
      where: {
        uploaded_by: userId,
      },
    });
  }

  async UploadFiles(payload: UploadBodyDTO, userId?: string) {
    const { originalName, buffer, mimeType, size } = payload.file;
    const fileName = `attachment-${userId}-${Date.now()}-${originalName}`;
    const uploadedData = await this.supabase.uploadFile(fileName, buffer);

    return await this.prisma.file.create({
      data: {
        filename: fileName,
        url: uploadedData.fullPath,
        mimetype: mimeType,
        size: size,
        user: {
          connect: {
            user_id: userId,
          },
        },
      },
    });
  }

  async DeleteFiles(payload: DeleteFileDTO) {
    await this.prisma.file.delete({
      where: {
        file_id: payload.file_id,
      },
    });

    return await this.supabase.deleteFile(payload.file_name);
  }
}
