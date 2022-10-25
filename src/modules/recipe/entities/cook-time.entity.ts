import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Allow, IsInt } from 'class-validator';
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
    @IsInt()
    @ApiProperty()
    total: number;

    @Column({
        type: 'int',
    })
    @IsInt()
    @ApiProperty()
    prep: number;

    @Column({
        type: 'int',
    })
    @IsInt()
    @ApiProperty()
    chill: number;

    @Column({
        type: 'int',
    })
    @IsInt()
    @ApiProperty()
    cook: number;

    @OneToOne(() => Recipe, (recipe) => recipe.cookTime, {
        onDelete: 'CASCADE',
    })
    @Allow()
    @Type(() => Recipe)
    recipe: Recipe;
}
