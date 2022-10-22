import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Star } from './entities/star.entity';
import CookTime from './entities/cook-time.entity';
import Ingredient from './entities/ingredient.entity';
import Instruction from './entities/instruction.entity';
import Nutrition from './entities/nutrition.entity';
import Recipe from './entities/recipe.entity';
import { RecipeController } from './recipe.controller';
import { IngredientService } from './services/ingredient.service';
import { RecipeService } from './services/recipe.service';
import Comment from './entities/comment.entity';

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
        ]),
    ],
    controllers: [RecipeController],
    providers: [RecipeService, IngredientService],
    exports: [TypeOrmModule, RecipeService],
})
export class RecipeModule {}
