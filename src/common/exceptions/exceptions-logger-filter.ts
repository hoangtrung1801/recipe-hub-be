import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export default class ExceptionsLoggerFilter extends BaseExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void {
        console.log('Exception thrown', exception);
        super.catch(exception, host);
    }
}
