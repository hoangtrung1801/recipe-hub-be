import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Star } from './entities/star.entity';
import CookTime from './entities/cook-time.entity';
import Ingredient from './entities/ingredient.entity';
import Instruction from './entities/instruction.entity';
import Nutrition from './entities/nutrition.entity';
import Recipe from './entities/recipe.entity';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './services/recipe.service';
import Comment from './entities/comment.entity';
import Changelog from './entities/changelog.entity';
import Catalog from '../catalog/entities/catalog.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Recipe,
            Ingredient,
            CookTime,
            Nutrition,
            Instruction,
            Star,
            Comment,
            Changelog,
            Catalog,
        ]),
    ],
    controllers: [RecipeController],
    providers: [RecipeService],
    exports: [TypeOrmModule, RecipeService],
})
export class RecipeModule {}
