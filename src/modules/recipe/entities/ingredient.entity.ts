import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    Allow,
    IsEnum,
    IsNumber,
    IsString,
    ValidateNested,
} from 'class-validator';
import IngredientUnit from 'src/common/enums/ingredient-unit.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Recipe from './recipe.entity';

@Entity()
export default class Ingredient {
    @PrimaryGeneratedColumn('uuid')
    @Allow()
    id?: string;

    @ManyToOne(() => Recipe, (recipe: Recipe) => recipe.ingredients, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @Type(() => Recipe)
    @ValidateNested()
    recipe: Recipe;

    @Column()
    @IsString()
    @ApiProperty()
    name: string;

    @Column({
        type: 'float',
    })
    @IsNumber()
    @ApiProperty()
    amount: number;

    @Column()
    @IsString()
    @ApiProperty()
    unit: string;
}
