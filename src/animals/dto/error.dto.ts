import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty({
    description: 'status of the error response',
    type: 'Number',
    example: '400 | 404 | 500',
  })
  status: number;

  @ApiProperty({
    description: 'error message',
    type: 'String',
    example: 'Bad request | Not found | Internal server error',
  })
  message: string;
}
