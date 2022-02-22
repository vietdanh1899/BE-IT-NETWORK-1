import { ApiProperty } from '@nestjs/swagger';

export class ShortListDTO {
  @ApiProperty()
  applicantId: string;

  @ApiProperty()
  jobId: string;
}
