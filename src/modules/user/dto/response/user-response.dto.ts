import { AutoMap } from '@automapper/classes';
import AbstractResponseDto from 'src/common/abstract-response.dto';
import Role from 'src/common/enums/role.enum';

export class UserResponseDto extends AbstractResponseDto {
    @AutoMap()
    username: string;

    @AutoMap()
    name: number;

    @AutoMap()
    phone: number;

    @AutoMap()
    address: number;

    @AutoMap(() => String)
    role: Role;
}
