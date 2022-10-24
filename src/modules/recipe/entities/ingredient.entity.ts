import { Type } from 'class-transformer';
import {
    IsEnum,
    IsNumber,
    IsString,
    IsUUID,
    ValidateNested,
} from 'class-validator';
import IngredientUnit from 'src/common/enums/ingredient-unit.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Recipe from './recipe.entity';

@Entity()
export default class Ingredient {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
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
    name: string;

    @Column({
        type: 'float',
    })
    @IsNumber()
    amount: number;

    @Column({
        type: 'enum',
        enum: IngredientUnit,
    })
    @IsEnum(IngredientUnit)
    unit: IngredientUnit;
}
