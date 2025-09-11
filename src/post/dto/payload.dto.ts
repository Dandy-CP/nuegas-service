import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostBody {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachment: string[];
}

export class EditPostBody {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachment: string[];
}
