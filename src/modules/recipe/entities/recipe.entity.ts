import AbstractEntity from 'src/common/abstract.entity';
import RecipeMode from 'src/common/dto/recipe-mode.enum';
import User from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export default class Recipe extends AbstractEntity {
    @Column()
    name: string;

    @Column()
    description: string;

    @Column({
        default: 0,
    })
    stars: number;

    @Column({
        default: 0,
    })
    forks: number;

    @Column({
        enum: RecipeMode,
    })
    mode: RecipeMode;

    @ManyToOne(() => User, (user: User) => user.recipes)
    user: User;

    constructor(partial: Partial<Recipe>) {
        super();
        Object.assign(this, partial);
    }
}
