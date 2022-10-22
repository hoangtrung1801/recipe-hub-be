import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateRecipeDto } from '../dto/request/update-recipe.dto';
import { Star } from '../entities/star.entity';
import Recipe from '../entities/recipe.entity';
import Comment from '../entities/comment.entity';

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(Recipe)
        private readonly recipeRepository: Repository<Recipe>,

        @InjectRepository(Star)
        private readonly starRepository: Repository<Star>,

        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) {}

    async findAll() {
        return this.recipeRepository.find();
    }

    async findOne(id: string) {
        return this.recipeRepository.findOne({
            where: {
                id,
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
        return this.findOne(id);
    }

    async delete(id: string) {
        const recipe = this.findOne(id);
        await this.recipeRepository.delete(id);
        return recipe;
    }

    async star(id: string, user: User) {
        const recipe = await this.findOne(id);

        // increase number of stars
        await this.recipeRepository.update(id, {
            numberOfStar: recipe.numberOfStar + 1,
        });

        return this.starRepository.save({
            recipeId: id,
            userId: user.id,
            // recipeId: id,
            // userId: user.id,
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
        const recipe = await this.findOne(id);
        return this.commentRepository.save({
            ...comment,
            recipe,
            user,
        });
    }

    async forkRecipe(recipe: Recipe, recipeForked: Recipe, user: User) {
        // increase number of forks of recipe forked
        await this.recipeRepository.update(recipeForked.id, {
            numberOfFork: recipeForked.numberOfFork + 1,
        });

        const newRecipe = await this.create(
            {
                ...recipe,
                forkFrom: recipeForked,
            },
            user,
        );
        return newRecipe;
    }
}
