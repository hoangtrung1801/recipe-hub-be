import { AutoMap } from '@automapper/classes';
import { Exclude } from 'class-transformer';
import AbstractEntity from 'src/common/abstract.entity';
import Role from 'src/common/enums/role.enum';
import Recipe from 'src/modules/recipe/entities/recipe.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export default class User extends AbstractEntity {
    @AutoMap()
    @Column({ unique: true })
    username: string;

    @Column()
    @AutoMap()
    @Exclude()
    password: string;

    @AutoMap()
    @Column()
    name: string;

    @AutoMap()
    @Column({
        nullable: true,
    })
    phone: string;

    @AutoMap()
    @Column({
        nullable: true,
    })
    address: string;

    @AutoMap(() => String)
    @Column({
        default: Role.User,
        enum: Role,
    })
    role: Role;

    @OneToMany(() => Recipe, (recipe: Recipe) => recipe.user)
    recipes: Recipe[];

    constructor(partial: Partial<User>) {
        super();
        Object.assign(this, partial);
    }
}
