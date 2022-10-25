import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
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
    @ApiProperty()
    message: string;

    @ManyToOne(() => Recipe, (recipe) => recipe.changelogs, {
        onDelete: 'CASCADE',
    })
    @Allow()
    @Type(() => Recipe)
    recipe: Recipe;

    @ValidateNested({ each: true })
    @Type(() => Instruction)
    @ArrayMinSize(1)
    @ApiProperty({
        type: 'array',
        items: {
            oneOf: [{ $ref: getSchemaPath(Instruction) }],
        },
    })
    instructions?: Instruction[];
}
