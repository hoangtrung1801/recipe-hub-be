import { Type } from 'class-transformer';
import {
    Allow,
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsString,
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
import { Star } from './star.entity';

@Entity()
export default class Recipe extends AbstractEntity {
    @Column({
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @Column({
        nullable: false,
    })
    @IsString()
    description: string;

    @Column({
        default: 0,
        type: 'int',
    })
    @Allow()
    numberOfStar: number;

    @Column({
        default: 0,
        type: 'int',
    })
    @Allow()
    numberOfFork: number;

    @Column({
        type: 'enum',
        enum: RecipeMode,
    })
    @IsEnum(RecipeMode)
    mode: RecipeMode;

    @OneToOne(() => Recipe, {})
    @JoinColumn()
    @Allow()
    @Type(() => Recipe)
    forkFrom: Recipe;

    @ManyToOne(() => User, (user: User) => user.recipes, {
        nullable: false,
    })
    @Type(() => User)
    @Allow()
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
    instructions: Instruction[];

    @OneToOne(() => CookTime, {
        cascade: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn()
    @ValidateNested()
    @Type(() => CookTime)
    @IsNotEmpty()
    cookTime: CookTime;

    @OneToOne(() => Nutrition, (nutrition) => nutrition.recipe, {
        cascade: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn()
    @ValidateNested()
    @Type(() => Nutrition)
    @IsNotEmpty()
    nutrition: Nutrition;

    @OneToMany(() => Star, (star) => star.recipe)
    @Allow()
    @Type(() => Star)
    stars: Star[];

    @OneToMany(() => Comment, (comment) => comment.recipe)
    @Allow()
    @Type(() => Comment)
    comments: Comment[];

    @ManyToMany(() => Catalog, (catalog) => catalog.recipes)
    @JoinTable()
    @Type(() => Catalog)
    @IsArray()
    @ArrayMinSize(1)
    catalogs: Catalog[];

    @OneToMany(() => Changelog, (changelog) => changelog.recipe)
    @Allow()
    @Type(() => Changelog)
    changelogs: Changelog[];

    constructor(partial: Partial<Recipe>) {
        super();
        Object.assign(this, partial);
    }
}
