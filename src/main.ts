import {
    ClassSerializerInterceptor,
    Logger,
    ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import getLogLevels from './libs/get-log-levels';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: getLogLevels(process.env.NODE_ENV === 'production'),
    });

    app.use(helmet());
    app.use(compression());
    app.use(cookieParser());

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new ResponseInterceptor());

    app.enableCors();

    await app.listen(AppModule.port);
    return AppModule.port;
}
bootstrap().then((port) => {
    Logger.log(`Application is running on port ${port}`);
});
