import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserNotExistException } from 'src/common/exceptions/user-not-exist.exception';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import User from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto) {
        console.log(createUserDto);
        return this.userRepository.save({
            ...createUserDto,
        });
    }

    async findAll() {
        const allUsers: User[] = await this.userRepository.find();
        return allUsers;
    }

    async findOne(id: string) {
        const user: User = await this.userRepository.findOne({
            where: {
                id,
            },
        });
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        await this.userRepository.update(id, {
            ...updateUserDto,
        });
        return this.findOne(id);
    }

    async delete(id: string) {
        const user = await this.findOne(id);
        await this.userRepository.delete(id);
        return user;
    }

    async findOneByUsername(username: string) {
        const user: User = await this.userRepository.findOne({
            where: {
                username,
            },
        });

        if (!user) {
            throw new UserNotExistException(username);
        }
        return user;
    }
}
