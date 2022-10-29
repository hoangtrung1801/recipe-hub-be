import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import defaultConnection from './typeorm-config';

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
