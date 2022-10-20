import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecipeDto } from './dto/request/create-recipe.dto';
import { UpdateRecipeDto } from './dto/request/update-recipe.dto';
import Recipe from './entities/recipe.entity';

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(Recipe)
        private readonly recipeService: Repository<Recipe>,
    ) {}

    async findAll() {
        return this.recipeService.find();
    }

    async findOne(id: string) {
        return this.recipeService.find({
            where: {
                id,
            },
        });
    }

    async create(createRecipeDto: CreateRecipeDto) {
        const recipe = await this.recipeService.save(createRecipeDto);
        return recipe;
    }

    async update(id: string, updateRecipeDto: UpdateRecipeDto) {
        await this.recipeService.update(id, {
            ...updateRecipeDto,
        });
        return this.findOne(id);
    }

    async delete(id: string) {
        const recipe = this.findOne(id);
        await this.recipeService.delete(id);
        return recipe;
    }
}
