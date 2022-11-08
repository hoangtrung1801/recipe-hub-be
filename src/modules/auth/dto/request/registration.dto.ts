import { OmitType } from '@nestjs/swagger';
import Role from 'src/common/enums/role.enum';
import { CreateUserDto } from 'src/modules/user/dto/request/create-user.dto';

export class RegistrationDto extends OmitType(CreateUserDto, ['role']) {
    role = Role.User;
}
