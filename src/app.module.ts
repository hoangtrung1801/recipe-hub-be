import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configurations, { IConfigration } from './common/configurations';
import { RolesGuard } from './common/guards/roles.guard';
import LogsMiddleware from './common/middlewares/logs.middleware';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { CatalogModule } from './modules/catalog/catalog.module';
import { RecipeModule } from './modules/recipe/recipe.module';
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            load: [configurations],
            cache: true,
        }),
        DatabaseModule,
        UserModule,
        AuthModule,
        RecipeModule,
        CatalogModule,
        UploadModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class AppModule implements NestModule {
    static port: number;
    static secretKey: string;

    constructor(private readonly configService: ConfigService<IConfigration>) {
        AppModule.port = this.configService.get('port');
        AppModule.secretKey = this.configService.get('secretKey');
    }

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LogsMiddleware).forRoutes('*');
    }
}
