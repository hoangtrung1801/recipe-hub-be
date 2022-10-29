import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import configurations from './common/configurations';
import { DatabaseModule } from './database/database.module';
import { UserSeeder } from './database/seeds/user.seeder';
import User from './modules/user/entities/user.entity';

seeder({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            load: [configurations],
            cache: true,
        }),
        DatabaseModule,
        TypeOrmModule.forFeature([User]),
    ],
}).run([UserSeeder]);
