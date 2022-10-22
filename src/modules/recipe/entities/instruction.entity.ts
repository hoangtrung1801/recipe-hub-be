import { Type } from 'class-transformer';
import { Allow, IsInt } from 'class-validator';
import AbstractEntity from 'src/common/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import Recipe from './recipe.entity';

@Entity()
export default class Instruction extends AbstractEntity {
    @ManyToOne(() => Recipe, (recipe: Recipe) => recipe.instructions, {
        nullable: false,
    })
    @Type(() => Recipe)
    @Allow()
    recipe: Recipe;

    // changelog: Changelog;

    @Column({
        type: 'int',
    })
    @IsInt()
    stepNo: number;

    @Column({
        type: 'int',
    })
    @IsInt()
    description: string;
}