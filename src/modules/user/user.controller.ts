import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    SerializeOptions,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import Role from 'src/common/enums/role.enum';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
    strategy: 'exposeAll',
})
@ApiTags('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Public()
    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Post()
    @Roles(Role.Admin)
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @Roles(Role.Admin)
    remove(@Param('id') id: string) {
        return this.userService.delete(id);
    }
}
