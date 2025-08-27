import { IsString } from 'class-validator';

export class onSendMessageBody {
  @IsString()
  message: string;
}

export class onDeleteMessageBody {
  @IsString()
  message_id: string;
}

export class onEditMessageBody {
  @IsString()
  message_id: string;

  @IsString()
  new_message: string;
}

export class onReadMessageBody {
  @IsString()
  message_id: string;

  @IsString()
  read_at: string;
}
