import { PartialType } from '@nestjs/mapped-types';
import Recipe from '../../entities/recipe.entity';

export class UpdateRecipeDto extends PartialType(Recipe) {}
