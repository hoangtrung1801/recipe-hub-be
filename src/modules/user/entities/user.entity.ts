import { AutoMap } from '@automapper/classes';
import { Exclude, Type } from 'class-transformer';
import {
    Allow,
    IsEnum,
    IsPhoneNumber,
    IsString,
    ValidateNested,
} from 'class-validator';
import AbstractEntity from 'src/common/abstract.entity';
import Role from 'src/common/enums/role.enum';
import { Star } from 'src/modules/recipe/entities/star.entity';
import Recipe from 'src/modules/recipe/entities/recipe.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export default class User extends AbstractEntity {
    @AutoMap()
    @Column({ unique: true })
    @IsString()
    username: string;

    @Column()
    @AutoMap()
    @Exclude()
    @IsString()
    password: string;

    @AutoMap()
    @Column()
    @IsString()
    name: string;

    @AutoMap()
    @Column({
        nullable: true,
    })
    @IsPhoneNumber('VN')
    phone: string;

    @AutoMap()
    @Column({
        nullable: true,
    })
    @IsString()
    address: string;

    @AutoMap(() => String)
    @Column({
        type: 'enum',
        default: Role.User,
        enum: Role,
    })
    @IsEnum(Role)
    role: Role;

    @OneToMany(() => Recipe, (recipe: Recipe) => recipe.user)
    @Type(() => Recipe)
    @ValidateNested({ each: true })
    recipes: Recipe[];

    @OneToMany(() => Star, (star) => star.recipe)
    @Type(() => Star)
    @Allow()
    stars: Star[];

    constructor(partial: Partial<User>) {
        super();
        Object.assign(this, partial);
    }
}
