import {
    ArgumentsHost,
    Catch,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import ResponseStatus from '../enums/response-status.enum';

@Catch()
export default class HttpExceptionFilter extends BaseExceptionFilter {
    private readonly logger = new Logger(HttpException.name);

    catch(exception: HttpException | Error, host: ArgumentsHost): void {
        const http = host.switchToHttp();
        const response = http.getResponse<Response>();
        // this.logger.error(exception);

        // if (exception instanceof Error) {
        //     response.status(HttpStatus.NOT_ACCEPTABLE).json({
        //         status: ResponseStatus.ERROR,
        //         message: exception.message,
        //     });
        // } else {
        //     const status = (exception as HttpException).getStatus();
        //     const httpResponse = (exception as HttpException).getResponse();
        //     const message = (exception as HttpException).message;
        //     response.status(status).json(
        //         status === HttpStatus.BAD_REQUEST
        //             ? {
        //                   status: ResponseStatus.FAIL,
        //                   data: httpResponse['message'] || message,
        //               }
        //             : {
        //                   status: ResponseStatus.ERROR,
        //                   message: httpResponse['message'] || message,
        //               },
        //     );
        // }
        const status = (exception as HttpException).getStatus();
        const httpResponse = (exception as HttpException).getResponse();
        const message = (exception as HttpException).message;
        response.status(status).json(
            status === HttpStatus.BAD_REQUEST
                ? {
                      status: ResponseStatus.ERROR,
                      message: httpResponse['message'] || message,
                  }
                : {
                      status: ResponseStatus.ERROR,
                      message: httpResponse['message'] || message,
                  },
        );
    }
}
