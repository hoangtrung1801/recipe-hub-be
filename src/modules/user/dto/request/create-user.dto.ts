import { ApiProperty, PickType } from '@nestjs/swagger';
import User from '../../entities/user.entity';

export class CreateUserDto extends PickType(User, [
    'username',
    'password',
    'name',
    'phone',
    'role',
    'address',
]) {
    @ApiProperty()
    password: string;
}
