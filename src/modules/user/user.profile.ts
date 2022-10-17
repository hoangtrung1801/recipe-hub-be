import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import User from './entities/user.entity';

export class UserProfile extends AutomapperProfile {
    constructor(
        @InjectMapper()
        mapper: Mapper,
    ) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper) => {
            createMap(mapper, User, UserResponseDto);
            createMap(mapper, CreateUserDto, User);
            createMap(mapper, UpdateUserDto, User);
        };
    }
}
