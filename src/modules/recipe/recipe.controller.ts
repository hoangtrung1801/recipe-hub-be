import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import Role from 'src/common/enums/role.enum';
import { CreateRecipeDto } from './dto/request/create-recipe.dto';
import { UpdateRecipeDto } from './dto/request/update-recipe.dto';
import { RecipeService } from './recipe.service';

@Controller('recipes')
export class RecipeController {
    constructor(private readonly recipeService: RecipeService) {}

    @Get()
    @Public()
    findAll() {
        return this.recipeService.findAll();
    }

    @Get(':id')
    @Public()
    findOne(@Param('id') id: string) {
        return this.recipeService.findOne(id);
    }

    @Post()
    @Roles(Role.Admin, Role.User)
    create(@Body() createRecipeDto: CreateRecipeDto) {
        return this.recipeService.create(createRecipeDto);
    }

    @Put(':id')
    @Roles(Role.Admin, Role.User)
    update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
        return this.recipeService.update(id, updateRecipeDto);
    }

    @Delete(':id')
    @Roles(Role.Admin, Role.User)
    delete(@Param('id') id: string) {
        return this.recipeService.delete(id);
    }
}
