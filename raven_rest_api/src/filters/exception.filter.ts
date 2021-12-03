import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { responseMessages } from '../constant/message.constant';
import ApiResponse from '../api/shared/dto/api-response.dto';
import envConfig from 'src/config/env.config';
@Catch()
class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<FastifyReply>();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message;
    if (status === HttpStatus.NOT_FOUND)
      message = message || responseMessages.NOT_FOUND;

    const res = new ApiResponse(false, null, message);
    // if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
    //   if (envConfig.env === 'development') {
    //     res['stack'] = exception.stack;
    //     response.status(status).send(res);
    //   } else {
    //     response.status(status).send(res);
    //   }
    // }
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      if (envConfig.env === 'development') {
        res['stack'] = exception.stack;
      }
    }
    response.status(status).send(res);
  }
}

export default GlobalExceptionFilter;
