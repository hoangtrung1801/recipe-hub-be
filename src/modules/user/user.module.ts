import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { UserController } from './user.controller';
import { UserProfile } from './user.profile';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService, UserProfile],
    exports: [TypeOrmModule, UserService],
})
export class UserModule {}
