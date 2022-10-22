import { Type } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsObject,
    IsString,
    ValidateNested,
} from 'class-validator';
import RecipeMode from 'src/common/dto/recipe-mode.enum';
import CookTime from '../../entities/cook-time.entity';
import Ingredient from '../../entities/ingredient.entity';
import Instruction from '../../entities/instruction.entity';
import Nutrition from '../../entities/nutrition.entity';

export class CreateRecipeDto {
    // @IsString()
    // @IsNotEmpty()
    // name: string;
    // @IsString()
    // @IsNotEmpty()
    // description: string;
    // @IsEnum(RecipeMode)
    // @IsNotEmpty()
    // mode: RecipeMode;
    // // @Allow()
    // // @Type(() => Instruction)
    // @ValidateNested({
    //     each: true,
    // })
    // @Type()
    // instructions: Instruction[];
    // ingredients: Ingredient[];
    // cookTime: CookTime;
    // nutrition: Nutrition;
}
