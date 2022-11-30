import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Allow, IsInt, IsString } from 'class-validator';
import AbstractEntity from 'src/common/abstract.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import Ingredient from './ingredient.entity';
import Recipe from './recipe.entity';

@Entity()
export default class Instruction extends AbstractEntity {
    @ManyToOne(() => Recipe, (recipe: Recipe) => recipe.instructions, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @Type(() => Recipe)
    @Allow()
    recipe: Recipe;

    // changelog: Changelog;

    @Column({
        type: 'int',
    })
    @IsInt()
    @ApiProperty()
    stepNo: number;

    @Column()
    @IsString()
    @ApiProperty()
    description: string;

    // @ManyToMany(() => Ingredient, (ingredient) => ingredient.instructions)
    // @Allow()
    // @Type(() => Ingredient)
    // ingredients: Ingredient[];
    @Column('json', { default: '[]', nullable: true })
    @Allow()
    @ApiProperty()
    ingredients: string[];
}
