import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAssignmentBody {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

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
}

export class CreateSubmissionResultBody {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  attachment: string[];
}

export class GivePointBody {
  @IsNotEmpty()
  @IsNumber()
  point: number;
}

export class UpdateAssignmentStatusBody {
  @IsNotEmpty()
  @IsBoolean()
  is_available: boolean;
}
