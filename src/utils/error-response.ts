import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorDto } from 'src/animals/dto/error.dto';

export const getStatusAndErrorMsg = <T>(exception: T): ErrorDto => {
  if (exception instanceof HttpException) {
    return {
      status: exception.getStatus(),
      message: exception['response']['message'],
    };
  }

  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Unexpected error. Sorry for a trouble',
  };
};
