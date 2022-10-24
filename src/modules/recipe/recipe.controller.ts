import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    SerializeOptions,
    UseInterceptors,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RequestWithUser } from 'src/common/dto/request-with-user.dto';
import Role from 'src/common/enums/role.enum';
import { ForkRecipeDto } from './dto/request/fork-recipe.dto';
import { UpdateRecipeDto } from './dto/request/update-recipe.dto';
import Changelog from './entities/changelog.entity';
import Comment from './entities/comment.entity';
import Recipe from './entities/recipe.entity';
import { IngredientService } from './services/ingredient.service';
import { RecipeService } from './services/recipe.service';

@Controller('recipes')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
    strategy: 'exposeAll',
})
export class RecipeController {
    constructor(
        private readonly recipeService: RecipeService,
        private readonly ingredientService: IngredientService,
    ) {}

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

    @Get(':id/stars')
    @Public()
    getAllStars(@Param('id') id: string) {
        return this.recipeService.getAllStars(id);
    }

    @Get(':id/comments')
    @Public()
    getAllComments(@Param('id') id: string) {
        return this.recipeService.getAllComments(id);
    }

    @Get(':id/changelogs')
    getAllChangelogs(@Param('id') id: string) {
        return this.recipeService.findAllChangelogs(id);
    }

    @Get(':id/changelog')
    getCurrentChangelog(@Param('id') id: string) {
        return this.recipeService.getCurrentChangelog(id);
    }

    @Get(':id/changelogs/:changelogId')
    getChangelog(
        @Param('id') id: string,
        @Param('changelogId') changelogId: string,
    ) {
        return this.recipeService.findChangelogById(id, changelogId);
    }

    @Get(':id/instructions')
    getInstructions(@Param('id') id: string) {
        return this.recipeService.getCurrentInstructions(id);
    }

    @Post()
    @Roles(Role.Admin, Role.User)
    create(@Body() recipe: Recipe, @Req() req: RequestWithUser) {
        const currentUser = req.user;
        return this.recipeService.create(recipe, currentUser);
    }

    @Post(':id/stars')
    starRecipe(@Param('id') id: string, @Req() req: RequestWithUser) {
        const currentUser = req.user;
        return this.recipeService.star(id, currentUser);
    }

    @Post(':id/fork')
    async forkRecipe(
        @Param('id') id: string,
        @Req() req: RequestWithUser,
        @Body() forkRecipeDto: ForkRecipeDto,
    ) {
        const currentUser = req.user;
        return this.recipeService.forkRecipe(id, forkRecipeDto, currentUser);
    }

    @Post(':id/comments')
    createComment(
        @Param('id') id: string,
        @Req() req: RequestWithUser,
        @Body() comment: Comment,
    ) {
        const currentUser = req.user;
        return this.recipeService.createComment(id, comment, currentUser);
    }

    @Post(':id/changelogs')
    createChangelog(@Param('id') id: string, @Body() changelog: Changelog) {
        return this.recipeService.createChangelog(id, changelog);
    }

    @Put(':id')
    @Roles(Role.Admin, Role.User)
    update(@Param('id') id: string, @Body() recipe: UpdateRecipeDto) {
        return this.recipeService.update(id, recipe);
    }

    @Delete(':id')
    @Roles(Role.Admin, Role.User)
    delete(@Param('id') id: string) {
        return this.recipeService.delete(id);
    }
}
