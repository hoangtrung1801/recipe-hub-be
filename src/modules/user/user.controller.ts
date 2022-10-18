import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpException,
    HttpStatus,
    HttpCode,
    Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { Public } from 'src/common/decorators/set-metadata.decorator';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

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

    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.delete(id);
    }
}
