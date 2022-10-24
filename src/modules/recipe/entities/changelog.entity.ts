import { Type } from 'class-transformer';
import { Allow, ArrayMinSize, IsString, ValidateNested } from 'class-validator';
import AbstractEntity from 'src/common/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import Instruction from './instruction.entity';
import Recipe from './recipe.entity';

@Entity()
export default class Changelog extends AbstractEntity {
    @Column()
    @IsString()
    message: string;

    @ManyToOne(() => Recipe, (recipe) => recipe.changelogs)
    @Allow()
    @Type(() => Recipe)
    recipe: Recipe;

    @ValidateNested({ each: true })
    @Type(() => Instruction)
    @ArrayMinSize(1)
    instructions?: Instruction[];
}
