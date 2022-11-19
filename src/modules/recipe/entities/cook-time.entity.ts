import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Allow, IsNumber } from 'class-validator';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import Recipe from './recipe.entity';

@Entity()
export default class CookTime {
    @PrimaryGeneratedColumn('uuid')
    @Allow()
    id: string;

    @Column({
        type: 'int',
    })
    @IsNumber()
    @ApiProperty()
    total: number;

    @Column({
        type: 'int',
    })
    @IsNumber()
    @ApiProperty()
    prep: number;

    @Column({
        type: 'int',
    })
    @IsNumber()
    @ApiProperty()
    chill: number;

    @Column({
        type: 'int',
    })
    @IsNumber()
    @ApiProperty()
    cook: number;

    @OneToOne(() => Recipe, (recipe) => recipe.cookTime, {
        onDelete: 'CASCADE',
    })
    @Allow()
    @Type(() => Recipe)
    recipe: Recipe;
}
