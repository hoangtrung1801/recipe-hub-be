import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import HttpExceptionFilter from './common/exceptions/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import getLogLevels from './libs/get-log-levels';
import Catalog from './modules/catalog/entities/catalog.entity';
import CookTime from './modules/recipe/entities/cook-time.entity';
import Ingredient from './modules/recipe/entities/ingredient.entity';
import Instruction from './modules/recipe/entities/instruction.entity';
import Nutrition from './modules/recipe/entities/nutrition.entity';
import Recipe from './modules/recipe/entities/recipe.entity';
import User from './modules/user/entities/user.entity';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: getLogLevels(process.env.NODE_ENV === 'production'),
    });

    app.use(helmet());
    app.use(compression());
    app.use(cookieParser());

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle('Recipe Hub')
        .setVersion('1.0')
        // .addCookieAuth('Authorization')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config, {
        extraModels: [
            Recipe,
            User,
            Ingredient,
            Instruction,
            CookTime,
            Nutrition,
            Catalog,
        ],
    });
    SwaggerModule.setup('/api/docs', app, document);

    await app.listen(AppModule.port);
    return AppModule.port;
}
bootstrap().then((port) => {
    Logger.log(`Application is running on port ${port}`);
});
