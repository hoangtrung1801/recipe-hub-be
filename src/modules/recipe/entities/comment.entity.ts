import { Type } from 'class-transformer';
import { Allow, IsString } from 'class-validator';
import AbstractEntity from 'src/common/abstract.entity';
import User from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import Recipe from './recipe.entity';

@Entity()
export default class Comment extends AbstractEntity {
    @ManyToOne(() => Recipe, (recipe) => recipe.stars, {
        onDelete: 'CASCADE',
    })
    @Allow()
    @Type(() => Recipe)
    recipe: Recipe;

    @ManyToOne(() => User, (user) => user.stars)
    @Allow()
    @Type(() => User)
    user: User;

    @Column()
    @IsString()
    message: string;
}
