import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotExistRecipeException } from 'src/common/exceptions/not-exist-recipe.exception';
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
            order: {
                createdAt: 'ASC',
            },
        });
        return recipes;
    }

    async findOne(id: string, relations = true) {
        const recipe = await this.recipeRepository.findOne({
            where: {
                id,
            },
            relations: relations
                ? {
                      forkFrom: true,
                      ingredients: true,
                      cookTime: true,
                      nutrition: true,
                      comments: true,
                      catalogs: true,
                      user: true,
                      stars: true,
                  }
                : {},
            order: {
                comments: {
                    createdAt: 'ASC',
                },
            },
        });
        if (!recipe) throw new NotExistRecipeException(id);

        return recipe;
    }

    async create(recipeData: Recipe, user: User) {
        const changelog = this.changelogRepository.create({
            message: 'Init recipe',
            instructions: recipeData.instructions,
        });
        const recipe = await this.recipeRepository.save({
            user,
            changelogs: [changelog],
            ...recipeData,
        });
        return recipe;
    }

    async update(id: string, updateRecipeDto: UpdateRecipeDto) {
        const recipe = await this.findOne(id, false);

        await this.recipeRepository.update(id, {
            ...updateRecipeDto,
        });

        return {
            ...recipe,
            ...updateRecipeDto,
        };
    }

    async delete(id: string) {
        // await this.findOne(id, false);

        await this.recipeRepository.delete(id);

        return;
    }

    // Star
    async star(id: string, user: User) {
        const recipe = await this.recipeRepository.findOne({
            where: { id },
            relations: { stars: true },
        });
        if (!recipe) {
            throw new NotExistRecipeException(id);
        }

        if (recipe.stars.some((userStarred) => userStarred.id === user.id)) {
            throw new BadRequestException(`User starred this recipe.`);
        }

        recipe.stars = [...recipe.stars, user];
        return await this.recipeRepository.save(recipe);
    }

    async unstar(id: string, user: User) {
        const recipe = await this.findOneWithRelations(id, ['stars']);
        if (!recipe) {
            throw new NotExistRecipeException(id);
        }

        if (!recipe.stars.some((userStarred) => userStarred.id === user.id)) {
            throw new BadRequestException(`User didn't star this recipe.`);
        }

        recipe.stars = recipe.stars.filter(
            (userStarred) => userStarred.id !== user.id,
        );
        return this.recipeRepository.save(recipe);
    }

    async getAllStars(id: string) {
        const recipe = await this.recipeRepository.findOne({
            where: { id },
            relations: { stars: true },
        });
        if (!recipe) {
            throw new NotExistRecipeException(id);
        }

        return recipe.stars;
    }

    // Comments
    async getAllComments(id: string) {
        const comments = await this.commentRepository.find({
            where: {
                recipe: {
                    id,
                },
            },
            relations: {
                user: true,
            },
            order: {
                createdAt: 'desc',
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
                stars: true,
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
            imageUrl: recipe.imageUrl,
            user,
            ...forkRecipeDto,
        });

        return this.recipeRepository.save(newRecipe);
    }

    // Changelog
    async findAllChangelogs(id: string) {
        // const recipe = await this.recipeRepository.findOne({
        //     where: {
        //         id,
        //     },
        //     relations: {
        //         changelogs: true,
        //     },
        // });
        // return recipe.changelogs;
        const changelogs = await this.changelogRepository.find({
            where: {
                recipe: {
                    id,
                },
            },
            order: {
                createdAt: 'desc',
            },
        });
        return changelogs;
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

        if (!changelog) {
            throw new BadRequestException(`Changelog does not exist`);
        }

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

    private async findOneWithRelations(id: string, relations: string[] = []) {
        const relationsToObj = {};
        relations.map((relation) => (relationsToObj[relation] = true));
        return this.recipeRepository.findOne({
            where: { id },
            relations: relationsToObj,
        });
    }
}
