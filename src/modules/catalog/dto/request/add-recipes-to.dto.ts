import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class AddRecipesToDto {
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    @ApiProperty({
        isArray: true,
        type: String,
    })
    recipeIds: string[];
}
