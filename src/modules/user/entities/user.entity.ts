import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { Allow, IsEnum, IsPhoneNumber, IsString } from 'class-validator';
import AbstractEntity from 'src/common/abstract.entity';
import Role from 'src/common/enums/role.enum';
import Recipe from 'src/modules/recipe/entities/recipe.entity';
import { Star } from 'src/modules/recipe/entities/star.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export default class User extends AbstractEntity {
    @Column({ unique: true })
    @IsString()
    @ApiProperty()
    username: string;

    @Column()
    @Exclude({ toPlainOnly: true })
    @IsString()
    password: string;

    @Column()
    @IsString()
    @ApiProperty()
    name: string;

    @Column({
        nullable: true,
    })
    @IsPhoneNumber('VN')
    @ApiProperty()
    phone: string;

    @Column({
        nullable: true,
    })
    @IsString()
    @ApiProperty()
    address: string;

    @Column({
        type: 'enum',
        default: Role.User,
        enum: Role,
    })
    @IsEnum(Role)
    @ApiProperty({
        enum: Role,
    })
    role: Role;

    @OneToMany(() => Recipe, (recipe: Recipe) => recipe.user)
    @Type(() => Recipe)
    @Allow()
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
