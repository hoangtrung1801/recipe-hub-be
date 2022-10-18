import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import LogsMiddleware from './common/middlewares/logs.middleware';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        DatabaseModule,
        AutomapperModule.forRoot({
            strategyInitializer: classes(),
        }),
        UserModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule implements NestModule {
    static port: number;

    constructor(private readonly configService: ConfigService) {
        AppModule.port = configService.get('PORT');
    }

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LogsMiddleware).forRoutes('*');
    }
}
