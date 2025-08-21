import { IsOptional, IsString } from 'class-validator';

export class CommentQuery {
  @IsOptional()
  @IsString()
  post_id: string;

  @IsOptional()
  @IsString()
  assignment_id: string;

  @IsOptional()
  @IsString()
  quiz_id: string;

  @IsOptional()
  @IsString()
  assignments_result_id: string;

  @IsOptional()
  @IsString()
  quiz_result_id: string;
}
