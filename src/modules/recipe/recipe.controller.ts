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
    Query,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RequestWithUser } from 'src/common/dto/request-with-user.dto';
import Role from 'src/common/enums/role.enum';
import { ForkRecipeDto } from './dto/request/fork-recipe.dto';
import { UpdateRecipeDto } from './dto/request/update-recipe.dto';
import Changelog from './entities/changelog.entity';
import Comment from './entities/comment.entity';
import Recipe from './entities/recipe.entity';
import { RecipeService } from './services/recipe.service';

@Controller('recipes')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
    strategy: 'exposeAll',
})
@ApiTags('Recipe')
@ApiBearerAuth()
export class RecipeController {
    constructor(private readonly recipeService: RecipeService) {}

    /* GET */
    @Get()
    @Public()
    @ApiOperation({ summary: 'Get all recipes' })
    @ApiQuery({
        name: 'q',
        description: 'Search by name',
        required: false,
    })
    @ApiQuery({
        name: 'c',
        description: 'Search by category name',
        required: false,
    })
    // @ApiGlobalResponse({
    //     type: [Recipe],
    //     description: 'Return all recipes',
    // })
    findAll(@Query('q') q: string, @Query('c') c: string) {
        return this.recipeService.findAll(q, c);
    }

    @Get(':id')
    @Public()
    @ApiOperation({ summary: 'Get recipe by id' })
    // @ApiGlobalResponse({
    //     type: Recipe,
    //     description: 'Return user',
    // })
    findOne(@Param('id') id: string) {
        return this.recipeService.findOne(id);
    }

    @Get(':id/stars')
    @Public()
    @ApiOperation({
        summary: 'Get stars of recipe (include of user information)',
    })
    // @ApiGlobalResponse({
    //     type: [Star],
    //     description: 'Return all stars',
    // })
    getAllStars(@Param('id') id: string) {
        return this.recipeService.getAllStars(id);
    }

    @Get(':id/comments')
    @Public()
    @ApiOperation({
        summary: 'Get comments of recipe',
    })
    getAllComments(@Param('id') id: string) {
        return this.recipeService.getAllComments(id);
    }

    @Get(':id/changelogs')
    @Public()
    @ApiOperation({
        summary: 'Get changlogs of recipe',
    })
    getAllChangelogs(@Param('id') id: string) {
        return this.recipeService.findAllChangelogs(id);
    }

    @Get(':id/changelog')
    @Public()
    @ApiOperation({
        summary: 'Get current changelog',
    })
    getCurrentChangelog(@Param('id') id: string) {
        return this.recipeService.getCurrentChangelog(id);
    }

    @Get(':id/changelogs/:changelogId')
    @Public()
    @ApiOperation({
        summary: 'Get specific changeog of recipe by id',
    })
    getChangelog(
        @Param('id') id: string,
        @Param('changelogId') changelogId: string,
    ) {
        return this.recipeService.findChangelogById(id, changelogId);
    }

    @Get(':id/instructions')
    @Public()
    @ApiOperation({
        summary: 'Get all current instuctions',
    })
    getInstructions(@Param('id') id: string) {
        return this.recipeService.getCurrentInstructions(id);
    }

    /* POST */
    @Post()
    @Roles(Role.Admin, Role.User)
    @ApiOperation({
        summary: 'Create new recipe',
    })
    create(@Body() recipe: Recipe, @Req() req: RequestWithUser) {
        const currentUser = req.user;
        return this.recipeService.create(recipe, currentUser);
    }

    @Post(':id/stars')
    @ApiOperation({ summary: 'User star (like) recipe' })
    starRecipe(@Param('id') id: string, @Req() req: RequestWithUser) {
        const currentUser = req.user;
        return this.recipeService.star(id, currentUser);
    }

    @Post(':id/fork')
    @ApiOperation({ summary: 'User fork from recipe with id' })
    async forkRecipe(
        @Param('id') id: string,
        @Req() req: RequestWithUser,
        @Body() forkRecipeDto: ForkRecipeDto,
    ) {
        const currentUser = req.user;
        return this.recipeService.forkRecipe(id, forkRecipeDto, currentUser);
    }

    @Post(':id/comments')
    @ApiOperation({ summary: 'User comment in recipe (with recipe_id)' })
    createComment(
        @Param('id') id: string,
        @Req() req: RequestWithUser,
        @Body() comment: Comment,
    ) {
        const currentUser = req.user;
        return this.recipeService.createComment(id, comment, currentUser);
    }

    @Post(':id/changelogs')
    @ApiOperation({
        summary:
            'User update/create new changlog (including of updating instruction, nutrition, ...',
    })
    createChangelog(@Param('id') id: string, @Body() changelog: Changelog) {
        return this.recipeService.createChangelog(id, changelog);
    }

    /* PUT */
    @Put(':id')
    @Roles(Role.Admin, Role.User)
    @ApiOperation({ summary: "Update main recipe's information" })
    update(@Param('id') id: string, @Body() recipe: UpdateRecipeDto) {
        return this.recipeService.update(id, recipe);
    }

    /* DELETE */
    @Delete(':id')
    @Roles(Role.Admin, Role.User)
    @ApiOperation({ summary: 'Delete recipe' })
    delete(@Param('id') id: string) {
        return this.recipeService.delete(id);
    }
}
