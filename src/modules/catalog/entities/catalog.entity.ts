import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import AbstractEntity from 'src/common/abstract.entity';
import Recipe from 'src/modules/recipe/entities/recipe.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export default class Catalog extends AbstractEntity {
    @Column()
    @IsString()
    @ApiProperty()
    name: string;

    @Column()
    @IsString()
    @ApiProperty()
    description: string;

    @ManyToMany(() => Recipe, (recipe) => recipe.catalogs)
    @Type(() => Recipe)
    @IsString({ each: true })
    @IsOptional()
    @ApiProperty({ required: false, default: [] })
    recipes: Recipe[];
}
