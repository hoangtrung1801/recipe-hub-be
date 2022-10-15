import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import getLogLevels from './shared/getLogLevels';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: getLogLevels(process.env.NODE_ENV === 'production'),
    });

    app.use(helmet());
    app.use(compression());
    app.enableCors();

    await app.listen(3000);
}
bootstrap().then((port) => {
    Logger.log(`Application is running on port ${port}`);
});
