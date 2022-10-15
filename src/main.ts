import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import getLogLevels from './shared/get-log-levels';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: getLogLevels(process.env.NODE_ENV === 'production'),
    });

    app.use(helmet());
    app.use(compression());
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();

    await app.listen(3000);
}
bootstrap().then((port) => {
    Logger.log(`Application is running on port ${port}`);
});
