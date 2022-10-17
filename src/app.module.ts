import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import LogsMiddleware from './common/middlewares/logs.middleware';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

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
    ],
    controllers: [AppController],
    providers: [AppService],
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
