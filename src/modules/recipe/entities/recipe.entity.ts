import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    Allow,
    ArrayMinSize,
    IsEmpty,
    IsEnum,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    IsUrl,
    ValidateNested,
} from 'class-validator';
import AbstractEntity from 'src/common/abstract.entity';
import RecipeMode from 'src/common/dto/recipe-mode.enum';
import Catalog from 'src/modules/catalog/entities/catalog.entity';
import User from 'src/modules/user/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';
import Changelog from './changelog.entity';
import Comment from './comment.entity';
import CookTime from './cook-time.entity';
import Ingredient from './ingredient.entity';
import Instruction from './instruction.entity';
import Nutrition from './nutrition.entity';

@Entity()
export default class Recipe extends AbstractEntity {
    @Column({
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @Column({
        nullable: false,
    })
    @IsString()
    @ApiProperty()
    description: string;

    // @Column({
    //     default: 0,
    //     type: 'int',
    // })
    // @IsEmpty()
    // @ApiProperty()
    // numberOfStar: number;

    @Column({
        default: 0,
        type: 'int',
    })
    @IsEmpty()
    @ApiProperty()
    numberOfFork: number;

    @Column({
        type: 'enum',
        enum: RecipeMode,
    })
    @IsEnum(RecipeMode)
    @ApiProperty({
        enum: RecipeMode,
    })
    mode: RecipeMode;

    @ManyToOne(() => Recipe)
    @Type(() => Recipe)
    @IsOptional()
    @IsEmpty()
    // @ApiProperty({
    //     oneOf: [{ $ref: getSchemaPath(Recipe) }],
    // })
    forkFrom: Recipe;

    @ManyToOne(() => User, (user: User) => user.recipes, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @Type(() => User)
    @IsEmpty()
    // @ApiProperty({
    //     oneOf: [{ $ref: getSchemaPath(User) }],
    // })
    user: User;

    @OneToMany(
        () => Ingredient,
        (ingredient: Ingredient) => ingredient.recipe,
        {
            cascade: true,
        },
    )
    @ValidateNested({
        each: true,
    })
    @Type(() => Ingredient)
    @ApiProperty({
        type: 'array',
        items: {
            oneOf: [{ $ref: getSchemaPath(Ingredient) }],
        },
    })
    ingredients: Ingredient[];

    @OneToMany(
        () => Instruction,
        (instruction: Instruction) => instruction.recipe,
        {
            cascade: true,
        },
    )
    @Type(() => Instruction)
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @ApiProperty({
        type: 'array',
        items: {
            oneOf: [{ $ref: getSchemaPath(Instruction) }],
        },
    })
    instructions: Instruction[];

    @OneToOne(() => CookTime, {
        cascade: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn()
    @ValidateNested()
    @Type(() => CookTime)
    @ApiProperty({
        items: {
            oneOf: [{ $ref: getSchemaPath(CookTime) }],
        },
    })
    cookTime: CookTime;

    @OneToOne(() => Nutrition, (nutrition) => nutrition.recipe, {
        cascade: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn()
    @ValidateNested()
    @Type(() => Nutrition)
    @ApiProperty({
        items: {
            oneOf: [{ $ref: getSchemaPath(Nutrition) }],
        },
    })
    nutrition: Nutrition;

    @ManyToMany(() => User, (user) => user.stars)
    @JoinTable()
    @Type(() => User)
    @IsEmpty()
    stars: User[];

    @OneToMany(() => Comment, (comment) => comment.recipe)
    @Allow()
    @Type(() => Comment)
    @IsEmpty()
    comments: Comment[];

    @ManyToMany(() => Catalog, (catalog) => catalog.recipes)
    @JoinTable()
    @Type(() => Catalog)
    // @ValidateNested({ each: true })
    // @IsUUID('4', { each: true })
    @IsObject({ each: true })
    @ArrayMinSize(1)
    @ApiProperty({
        default: [{ id: 'catalogId1' }, { id: 'catalogId2' }],
        type: String,
        isArray: true,
    })
    catalogs: Catalog[];

    @OneToMany(() => Changelog, (changelog) => changelog.recipe, {
        cascade: true,
    })
    @Type(() => Changelog)
    @IsEmpty()
    changelogs: Changelog[];

    @Column({
        nullable: false,
    })
    @IsUrl()
    @ApiProperty()
    imageUrl: string;

    constructor(partial: Partial<Recipe>) {
        super();
        Object.assign(this, partial);
    }
}
