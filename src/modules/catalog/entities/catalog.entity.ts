import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import AbstractEntity from 'src/common/abstract.entity';
import Recipe from 'src/modules/recipe/entities/recipe.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export default class Catalog extends AbstractEntity {
    @Column()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ManyToMany(() => Recipe, (recipe) => recipe.catalogs)
    @Type(() => Recipe)
    @IsArray()
    recipes: Recipe[];
}
