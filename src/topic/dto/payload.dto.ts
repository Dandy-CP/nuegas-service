import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTopicBody {
  @IsNotEmpty()
  @IsString()
  name: string;
}
