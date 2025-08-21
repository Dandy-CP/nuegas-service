import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostBody {
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class EditPostBody {
  @IsNotEmpty()
  @IsString()
  content: string;
}
