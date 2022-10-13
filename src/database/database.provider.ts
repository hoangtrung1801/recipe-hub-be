import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import path from 'path';
import { User } from 'src/modules/user/entities/user.entity';

/**
 * Setup default connection in the application
 * @param config {ConfigService}
 */
const defaultConnection = (config: ConfigService): TypeOrmModuleOptions => ({
    // type: 'postgres',
    // host: config.get('TYPEORM_HOST'),
    // port: config.get('TYPEORM_PORT'),
    // username: config.get('TYPEORM_USERNAME'),
    // password: config.get('TYPEORM_PASSWORD'),
    // database: config.get('TYPEORM_DATABASE'),
    // autoLoadEntities: config.get('TYPEORM_AUTOLOAD') == 'true',
    // synchronize: config.get('TYPEORM_SYNCHRONIZE') == 'true',
    // logging: config.get('TYPEORM_LOGGING') == 'true',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'admin',
    password: 'admin',
    database: 'test-nestjs',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
});

export const databaseProviders = [
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: defaultConnection,
        inject: [ConfigService],
    }),
];
