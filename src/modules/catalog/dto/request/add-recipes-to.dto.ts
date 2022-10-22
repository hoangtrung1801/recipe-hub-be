import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class AddRecipesToDto {
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    recipeIds: string[];
}
