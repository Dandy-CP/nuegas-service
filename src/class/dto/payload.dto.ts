import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateClassBody {
  @IsNotEmpty()
  @IsString()
  class_name: string;

  @IsNotEmpty()
  @IsString()
  class_description: string;
}

export class UpdateClassBody {
  @IsNotEmpty()
  @IsString()
  class_name: string;

  @IsNotEmpty()
  @IsString()
  class_description: string;
}

export class InviteMemberBody {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  email: string[];
}
