import User from 'src/modules/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import Recipe from './recipe.entity';

@Entity()
export class Star {
    @ManyToOne(() => Recipe, (recipe) => recipe.stars, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'recipeId' })
    recipe: Recipe;

    @ManyToOne(() => User, (user) => user.stars)
    @JoinColumn({ name: 'userId' })
    user: User;

    @PrimaryColumn()
    recipeId: string;

    @PrimaryColumn()
    userId: string;
}
