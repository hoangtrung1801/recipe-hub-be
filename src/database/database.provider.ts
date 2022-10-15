import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import DatabaseLogger from './database-logger';

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
    migrations: ['src/database/migrations/*.ts'],
    logger: new DatabaseLogger(),
});

export const databaseProviders = [
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: defaultConnection,
        inject: [ConfigService],
        dataSourceFactory: async (options) => {
            const dataSource = await new DataSource(options).initialize();
            return dataSource;
        },
    }),
];
