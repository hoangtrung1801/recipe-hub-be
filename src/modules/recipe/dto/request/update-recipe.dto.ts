import { PartialType, PickType } from '@nestjs/swagger';
import Recipe from '../../entities/recipe.entity';

export class UpdateRecipeDto extends PartialType(
    PickType(Recipe, ['name', 'description', 'mode']),
) {}
