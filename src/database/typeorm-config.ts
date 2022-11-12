import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import DatabaseLogger from './database-logger';

/**
 * Setup default connection in the application
 * @param config {ConfigService}
 */
const defaultConnection = (config: ConfigService): TypeOrmModuleOptions =>
    config.get('database.type') === 'mariadb'
        ? {
              type: 'mariadb',
              host: config.get('database.host'),
              port: config.get('database.port'),
              username: config.get('database.username'),
              password: config.get('database.password'),
              database: config.get('database.name'),
              entities: [__dirname + '/../**/*.entity{.ts,.js}'],
              synchronize: config.get('database.synchronize'),
              migrations: ['src/database/migrations/*.ts'],
              logger: new DatabaseLogger(),
          }
        : {
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
          };

export default defaultConnection;
