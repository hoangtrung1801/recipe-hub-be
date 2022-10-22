import { Type } from 'class-transformer';
import { Allow, IsString } from 'class-validator';
import User from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import Recipe from './recipe.entity';

@Entity()
export default class Comment {
    @ManyToOne(() => Recipe, (recipe) => recipe.stars)
    @JoinColumn({ name: 'recipeId' })
    @Allow()
    @Type(() => Recipe)
    recipe: Recipe;

    @ManyToOne(() => User, (user) => user.stars)
    @JoinColumn({ name: 'userId' })
    @Allow()
    @Type(() => User)
    user: User;

    @PrimaryColumn()
    @Allow()
    recipeId: string;

    @PrimaryColumn()
    @Allow()
    userId: string;

    @Column()
    @IsString()
    message: string;
}
