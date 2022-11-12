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
import {
    ApiBearerAuth,
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger/dist';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import Role from 'src/common/enums/role.enum';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import User from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
    strategy: 'exposeAll',
})
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiOkResponse({
        description: 'Successfull',
        isArray: true,
        type: User,
    })
    findAll() {
        return this.userService.findAll();
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get user by id' })
    @ApiOkResponse({
        description: 'Successfull',
        type: User,
    })
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Public()
    @Get('/username/:username')
    @ApiOperation({ summary: 'Get user by username' })
    @ApiOkResponse({
        description: 'Successfull',
        type: User,
    })
    findOneByUsername(@Param('username') username: string) {
        console.log(username);
        return this.userService.findOneByUsername(username);
    }

    @Post()
    @Roles(Role.Admin)
    @ApiOperation({ summary: 'Create user' })
    @ApiOkResponse({
        description: 'Successfull',
        type: User,
    })
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update user' })
    @ApiBody({
        required: false,
        type: UpdateUserDto,
        description: "Entering user's informataion needing to update",
    })
    @ApiOkResponse({
        description: 'Successfull',
        type: User,
    })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @Roles(Role.Admin)
    @ApiOperation({ summary: 'Delete user' })
    @ApiOkResponse({
        description: 'Successfull',
        type: User,
    })
    remove(@Param('id') id: string) {
        return this.userService.delete(id);
    }
}
