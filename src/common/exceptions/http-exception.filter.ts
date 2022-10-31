import {
    ArgumentsHost,
    Catch,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import ResponseStatus from '../enums/response-status.enum';

@Catch()
export default class HttpExceptionFilter extends BaseExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void {
        const http = host.switchToHttp();
        const response = http.getResponse<Response>();

        response.status(exception.getStatus()).json(
            exception.getStatus() === HttpStatus.BAD_REQUEST
                ? {
                      status: ResponseStatus.FAIL,
                      data:
                          exception.getResponse()['message'] ||
                          exception.message,
                  }
                : {
                      status: ResponseStatus.ERROR,
                      message:
                          exception.getResponse()['message'] ||
                          exception.message,
                  },
        );
    }
}
