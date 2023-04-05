import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { getStatusAndErrorMsg } from 'src/utils/error-response';

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { status, message } = getStatusAndErrorMsg(exception);

    response.status(status).json({
      status,
      message,
    });
  }
}
