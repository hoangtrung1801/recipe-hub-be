import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';
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
    @ApiProperty()
    username: string;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @AutoMap()
    @IsPhoneNumber()
    @IsOptional()
    @ApiProperty()
    phone: string;

    @AutoMap()
    @IsString()
    @IsOptional()
    @ApiProperty()
    address: string;

    @AutoMap(() => String)
    @IsString()
    @IsOptional()
    @ApiProperty()
    role: Role;
}
