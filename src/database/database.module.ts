import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';

@Module({
    imports: [...databaseProviders],
    exports: [...databaseProviders],
})
export class DatabaseModule {}
