import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Req,
    Get,
    Param,
    Post,
    Put,
    SerializeOptions,
    UseInterceptors,
    UseGuards,
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
import RecipeMode from 'src/common/dto/recipe-mode.enum';
import { RequestWithUser } from 'src/common/dto/request-with-user.dto';
import Role from 'src/common/enums/role.enum';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import User from './entities/user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get user by username' })
    @ApiOkResponse({
        description: 'Successfull',
        type: User,
    })
    async findOneByUsername(
        @Req() req: RequestWithUser,
        @Param('username') username: string,
    ) {
        console.log('findOneByUsername', req.user);
        const user = await this.userService.findOneByUsername(username);
        user.recipes = user.recipes.filter((recipe) => {
            if (recipe.mode === RecipeMode.Public) return true;
            if (req?.user && recipe.user.id === req?.user.id) return true;
            return false;
        });
        return user;
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
