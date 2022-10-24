import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateRecipeDto } from '../dto/request/update-recipe.dto';
import Changelog from '../entities/changelog.entity';
import Comment from '../entities/comment.entity';
import Instruction from '../entities/instruction.entity';
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

    async findAll() {
        return this.recipeRepository.find();
    }

    async findOne(id: string) {
        return this.recipeRepository.findOne({
            where: {
                id,
            },
            relations: {
                forkFrom: true,
                user: true,
                ingredients: true,
                instructions: true,
                cookTime: true,
                nutrition: true,
                comments: true,
                catalogs: true,
                changelogs: true,
            },
        });
    }

    async create(recipeData: Recipe, user: User) {
        const recipe = await this.recipeRepository.save({
            ...recipeData,
            user,
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

    async star(id: string, user: User) {
        // const recipe = await this.findOne(id);

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
        const recipeWithStars = await this.recipeRepository.findOne({
            where: { id },
            relations: {
                stars: true,
            },
        });
        const { stars, numberOfStar } = recipeWithStars;
        return {
            numberOfStar,
            stars,
        };
    }

    async getAllComments(id: string) {
        const recipeWithComments = await this.recipeRepository.findOne({
            where: { id },
            relations: {
                comments: true,
            },
        });
        const { comments } = recipeWithComments;
        return {
            numberOfComments: comments.length,
            comments,
        };
    }

    async createComment(id: string, comment: Comment, user: User) {
        const recipe = await this.recipeRepository.findOne({ where: { id } });
        return this.commentRepository.save({
            ...comment,
            recipe,
            user,
        });
    }

    async forkRecipe(recipe: Recipe, recipeForked: Recipe, user: User) {
        // increase number of forks of recipe forked
        await this.recipeRepository.increment(
            {
                id: recipeForked.id,
            },
            'numberOfFork',
            1,
        );

        const newRecipe = await this.create(
            {
                ...recipe,
                forkFrom: recipeForked,
            },
            user,
        );
        return newRecipe;
    }

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
