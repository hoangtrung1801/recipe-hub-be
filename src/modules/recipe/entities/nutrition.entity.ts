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
    calories: number;

    @Column({
        type: 'float',
    })
    @IsNumber()
    protein: number;

    @Column({
        type: 'float',
    })
    @IsNumber()
    fiber: number;

    @Column({
        type: 'float',
    })
    @IsNumber()
    carbs: number;

    @Column({
        type: 'float',
    })
    @IsNumber()
    fats: number;

    @Column({
        type: 'float',
    })
    @IsNumber()
    sugar: number;

    @OneToOne(() => Recipe, (recipe) => recipe.nutrition)
    @Allow()
    @Type(() => Recipe)
    recipe: Recipe;
}
