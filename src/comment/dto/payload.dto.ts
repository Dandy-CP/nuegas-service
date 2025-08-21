import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentBody {
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class EditCommentBody {
  @IsNotEmpty()
  @IsString()
  content: string;
}
