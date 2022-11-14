import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
    Allow,
    IsEnum,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsUrl,
} from 'class-validator';
import AbstractEntity from 'src/common/abstract.entity';
import Role from 'src/common/enums/role.enum';
import Recipe from 'src/modules/recipe/entities/recipe.entity';
import { Star } from 'src/modules/recipe/entities/star.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

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

    @Column({ nullable: true, default: '' })
    @IsString()
    @IsOptional()
    @ApiProperty()
    description: string;

    @Column({
        nullable: true,
    })
    @IsUrl()
    @IsOptional()
    @ApiProperty()
    avatarUrl: string;

    @OneToMany(() => Recipe, (recipe: Recipe) => recipe.user)
    @Type(() => Recipe)
    @Allow()
    recipes: Recipe[];

    @ManyToMany(() => Recipe, (recipe) => recipe.stars)
    @Type(() => Star)
    @Allow()
    stars: Recipe[];

    constructor(partial: Partial<User>) {
        super();
        Object.assign(this, partial);
    }
}
