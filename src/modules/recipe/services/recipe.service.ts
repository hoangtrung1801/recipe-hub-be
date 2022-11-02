import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { deepCloneWithoutId } from 'src/libs/deep-clone';
import User from 'src/modules/user/entities/user.entity';
import { Like, Not, Repository } from 'typeorm';
import { ForkRecipeDto } from '../dto/request/fork-recipe.dto';
import { UpdateRecipeDto } from '../dto/request/update-recipe.dto';
import Changelog from '../entities/changelog.entity';
import Comment from '../entities/comment.entity';
import CookTime from '../entities/cook-time.entity';
import Ingredient from '../entities/ingredient.entity';
import Instruction from '../entities/instruction.entity';
import Nutrition from '../entities/nutrition.entity';
import Recipe from '../entities/recipe.entity';
import { Star } from '../entities/star.entity';

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(Recipe)
        private readonly recipeRepository: Repository<Recipe>,

        @InjectRepository(Star)
        private readonly starRepository: Repository<Star>,

        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,

        @InjectRepository(Changelog)
        private readonly changelogRepository: Repository<Changelog>,

        @InjectRepository(Instruction)
        private readonly instructionRepository: Repository<Instruction>,
    ) {}

    async findAll(q?: string, c?: string) {
        const recipes = await this.recipeRepository.find({
            where: {
                name: q ? Like(`%${q}%`) : Not(''),
                catalogs: c
                    ? {
                          name: Like(`%${c}%`),
                      }
                    : {},
            },
        });
        return recipes;
    }

    async findOne(id: string) {
        return this.recipeRepository.findOne({
            where: {
                id,
            },
            relations: {
                forkFrom: true,
                ingredients: true,
                cookTime: true,
                nutrition: true,
                comments: true,
                catalogs: true,
            },
            order: {
                comments: {
                    createdAt: 'ASC',
                },
            },
        });
    }

    async create(recipeData: Recipe, user: User) {
        const recipe = await this.recipeRepository.save({
            user,
            ...recipeData,
        });
        return recipe;
    }

    async update(id: string, updateRecipeDto: UpdateRecipeDto) {
        await this.recipeRepository.update(id, {
            ...updateRecipeDto,
        });
        return this.recipeRepository.findOne({
            where: { id },
        });
    }

    async delete(id: string) {
        const recipe = this.recipeRepository.findOne({ where: { id } });
        await this.recipeRepository.delete(id);
        return recipe;
    }

    // Star
    async star(id: string, user: User) {
        // increase number of stars
        await this.recipeRepository.increment(
            {
                id,
            },
            'numberOfStar',
            1,
        );

        return this.starRepository.save({
            recipeId: id,
            userId: user.id,
        });
    }

    async getAllStars(id: string) {
        const stars = await this.starRepository.find({
            where: {
                recipe: {
                    id,
                },
            },
        });
        return {
            numberOfStar: stars.length,
            stars,
        };
    }

    // Comments
    async getAllComments(id: string) {
        const comments = await this.commentRepository.find({
            where: {
                recipe: {
                    id,
                },
            },
            order: {
                createdAt: 'ASC',
            },
        });
        return {
            numberOfComments: comments.length,
            comments,
        };
    }

    async createComment(id: string, comment: Comment, user: User) {
        return this.commentRepository.save({
            ...comment,
            recipe: {
                id,
            },
            user,
        });
    }

    // Fork recipe
    async forkRecipe(
        recipeId: string,
        forkRecipeDto: ForkRecipeDto,
        user: User,
    ) {
        // increase number of forks of recipe forked
        await this.recipeRepository.increment(
            {
                id: recipeId,
            },
            'numberOfFork',
            1,
        );

        // *** NEED UPDATE LATER ***
        // get original recipe (except attr id)
        const recipe = await this.recipeRepository.findOne({
            where: {
                id: recipeId,
            },
            relations: {
                catalogs: true,
                changelogs: true,
                cookTime: true,
                ingredients: true,
                instructions: true,
                nutrition: true,
            },
        });

        const newRecipe = await this.recipeRepository.create({
            name: recipe.name,
            description: recipe.description,
            mode: recipe.mode,
            catalogs: recipe.catalogs,
            cookTime: deepCloneWithoutId<CookTime>(recipe.cookTime),
            nutrition: deepCloneWithoutId<Nutrition>(recipe.nutrition),
            changelogs: recipe.changelogs.map((changelog) =>
                deepCloneWithoutId<Changelog>(changelog),
            ),
            ingredients: recipe.ingredients.map((ingredient) =>
                deepCloneWithoutId<Ingredient>(ingredient),
            ),
            instructions: recipe.instructions.map((instruction) =>
                deepCloneWithoutId<Instruction>(instruction),
            ),
            forkFrom: {
                id: recipe.id,
            },
            user,
            ...forkRecipeDto,
        });

        return this.recipeRepository.save(newRecipe);
    }

    // Changelog
    async findAllChangelogs(id: string) {
        const recipe = await this.recipeRepository.findOne({
            where: {
                id,
            },
            relations: {
                changelogs: true,
            },
        });
        return recipe.changelogs;
    }

    async findChangelogById(recipeId: string, changelogId: string) {
        const changelog = await this.changelogRepository.findOne({
            where: {
                id: changelogId,
            },
        });
        const instrucionsInChangelog = await this.getInstructionsInChangelog(
            recipeId,
            changelog.id,
        );

        return {
            ...changelog,
            instructions: instrucionsInChangelog,
        } as Changelog;
    }

    async createChangelog(id: string, changelog: Changelog) {
        const { instructions } = changelog;

        // Save all instructions when creating changelog
        // <==> CASADE
        await this.instructionRepository.save(
            instructions.map((instruction) => ({
                ...instruction,
                recipe: {
                    id,
                },
            })),
        );

        return this.changelogRepository.save({
            ...changelog,
            recipe: {
                id,
            },
        });
    }

    async getCurrentChangelog(id: string) {
        const changelog = await this.changelogRepository.findOne({
            where: {
                recipe: {
                    id,
                },
            },
            order: {
                createdAt: 'DESC',
            },
        });

        return {
            ...changelog,
            instructions: await this.getInstructionsInChangelog(
                id,
                changelog.id,
            ),
        } as Changelog;
    }

    async getCurrentInstructions(id: string) {
        const changelog = await this.changelogRepository.findOne({
            where: {
                recipe: {
                    id,
                },
            },
            order: {
                createdAt: 'DESC',
            },
        });
        return this.getInstructionsInChangelog(id, changelog.id);
    }

    async getInstructionsInChangelog(recipeId: string, changelogId: string) {
        const changelog = await this.changelogRepository.findOne({
            where: {
                id: changelogId,
            },
        });

        const instructions = await this.instructionRepository.find({
            where: {
                recipe: {
                    id: recipeId,
                },
            },
            order: {
                stepNo: 'ASC',
                createdAt: 'DESC',
            },
        });

        let currentStepNo = 0;
        return instructions
            .map((instruction) => {
                if (instruction.stepNo <= currentStepNo) return null;
                currentStepNo = instruction.stepNo;
                return instruction;
            })
            .filter((instruction) => {
                return (
                    instruction !== null &&
                    instruction.createdAt.getTime() <=
                        changelog.createdAt.getTime()
                );
            });
    }
}
