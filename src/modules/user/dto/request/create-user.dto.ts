import { AutoMap } from '@automapper/classes';
import {
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
} from 'class-validator';
import Role from 'src/common/enums/role.enum';

export class CreateUserDto {
    @AutoMap()
    @IsString()
    @IsNotEmpty()
    username: string;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    password: string;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    name: string;

    @AutoMap()
    @IsPhoneNumber()
    @IsOptional()
    phone: string;

    @AutoMap()
    @IsString()
    @IsOptional()
    address: string;

    @AutoMap(() => String)
    @IsString()
    @IsNotEmpty()
    role: Role;
}
