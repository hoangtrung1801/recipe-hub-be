import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Ingredient from '../entities/ingredient.entity';

@Injectable()
export class IngredientService {
    constructor(
        @InjectRepository(Ingredient)
        private readonly ingredientRepository: Repository<Ingredient>,
    ) {}

    findAll() {
        return this.ingredientRepository.find();
    }

    findOne(id: string) {
        return this.ingredientRepository.findOne({
            where: {
                id,
            },
        });
    }

    create(createIngredientDto: Omit<Ingredient, 'id'>) {
        return this.ingredientRepository.save(createIngredientDto);
    }

    update(id: string, updateIngredientDto: Partial<Omit<Ingredient, 'id'>>) {
        return this.ingredientRepository.update(id, {
            ...updateIngredientDto,
        });
    }
}
