import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
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
    host: config.get('database.host'),
    port: config.get('database.port'),
    username: config.get('database.username'),
    password: config.get('database.password'),
    database: config.get('database.name'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: config.get('database.synchronize'),
    migrations: ['src/database/migrations/*.ts'],
    logger: new DatabaseLogger(),
});

export default defaultConnection;
