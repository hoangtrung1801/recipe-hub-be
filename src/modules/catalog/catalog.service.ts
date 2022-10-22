import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeService } from '../recipe/services/recipe.service';
import { AddRecipesToDto } from './dto/request/add-recipes-to.dto';
import Catalog from './entities/catalog.entity';

@Injectable()
export class CatalogService {
    constructor(
        @InjectRepository(Catalog)
        private readonly catalogRepository: Repository<Catalog>,
        private readonly recipeService: RecipeService,
    ) {}

    findAll() {
        return this.catalogRepository.find();
    }

    findOne(id: string) {
        return this.catalogRepository.findOne({
            where: { id },
            relations: {
                recipes: true,
            },
        });
    }

    create(catalog: Catalog) {
        return this.catalogRepository.save({
            ...catalog,
        });
    }

    async addRecipesTo(id: string, addRecipesToDto: AddRecipesToDto) {
        const catalog = await this.findOne(id);
        return this.catalogRepository.save({
            id,
            recipes: [
                ...catalog.recipes,
                ...addRecipesToDto.recipeIds.map((recipeId) => ({
                    id: recipeId,
                })),
            ],
        });
    }
}
