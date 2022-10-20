import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import RecipeMode from 'src/common/dto/recipe-mode.enum';

export class CreateRecipeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(RecipeMode)
    @IsNotEmpty()
    mode: RecipeMode;
}
