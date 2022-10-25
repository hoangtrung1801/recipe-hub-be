import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Allow, IsNumber } from 'class-validator';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import Recipe from './recipe.entity';

@Entity()
export default class Nutrition {
    @PrimaryGeneratedColumn('uuid')
    @Allow()
    id: string;

    @Column({
        type: 'float',
    })
    @IsNumber()
    @ApiProperty()
    calories: number;

    @Column({
        type: 'float',
    })
    @IsNumber()
    @ApiProperty()
    protein: number;

    @Column({
        type: 'float',
    })
    @IsNumber()
    @ApiProperty()
    fiber: number;

    @Column({
        type: 'float',
    })
    @IsNumber()
    @ApiProperty()
    carbs: number;

    @Column({
        type: 'float',
    })
    @IsNumber()
    @ApiProperty()
    fats: number;

    @Column({
        type: 'float',
    })
    @IsNumber()
    @ApiProperty()
    sugar: number;

    @OneToOne(() => Recipe, (recipe) => recipe.nutrition, {
        onDelete: 'CASCADE',
    })
    @Allow()
    @Type(() => Recipe)
    recipe: Recipe;
}
