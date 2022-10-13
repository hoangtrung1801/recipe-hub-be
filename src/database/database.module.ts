import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';

@Module({
    imports: [...databaseProviders],
})
export class DatabaseModule {}
