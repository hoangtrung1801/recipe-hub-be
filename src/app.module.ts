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
import configurations, { IConfigration } from './common/configurations';
import { RolesGuard } from './common/guards/roles.guard';
import { RecipeModule } from './modules/recipe/recipe.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            load: [configurations],
            cache: true,
        }),
        DatabaseModule,
        AutomapperModule.forRoot({
            strategyInitializer: classes(),
        }),
        UserModule,
        AuthModule,
        RecipeModule,
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
