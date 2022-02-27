import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class NotificationDTO {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

}
