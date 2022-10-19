import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import User from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectMapper()
        private readonly mapper: Mapper,
    ) {}

    async create(createUserDto: CreateUserDto) {
        const newUser = this.mapper.map(createUserDto, CreateUserDto, User);
        await this.userRepository.save(newUser);
        return newUser;

        // const getUserDto = this.mapper.map(newUser, User, UserResponseDto);
        // return getUserDto;
    }

    async findAll() {
        const allUsers: User[] = await this.userRepository.find();
        return allUsers;

        // const allUsersDto = allUsers.map((user) =>
        //     this.mapper.map(user, User, UserResponseDto),
        // );
        // return allUsersDto;
    }

    async findOne(id: string) {
        const user: User = await this.userRepository.findOne({
            where: {
                id,
            },
        });
        return user;

        // const userDto: UserResponseDto = this.mapper.map(
        //     user,
        //     User,
        //     UserResponseDto,
        // );
        // return userDto;
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
        return user;
        // const userDto: UserResponseDto = this.mapper.map(
        //     user,
        //     User,
        //     UserResponseDto,
        // );
        // return userDto;
    }
}
