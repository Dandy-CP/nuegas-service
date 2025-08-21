import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateQuizOptionDto {
  @IsString()
  text: string;

  @IsBoolean()
  is_correct: boolean;
}

export class CreateQuizContentDto {
  @IsString()
  question: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachment?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizOptionDto)
  options: CreateQuizOptionDto[];
}

export class CreateQuizBody {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  topic: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  attachment: string[];

  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @IsNotEmpty()
  @IsDateString()
  due_date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizContentDto)
  quiz_content: CreateQuizContentDto[];
}

class AnswerDto {
  @IsString()
  @IsNotEmpty()
  quiz_content_id: string;

  @IsString()
  @IsNotEmpty()
  selected_option_id: string;
}

export class SubmitQuizDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
