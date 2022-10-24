import { OmitType, PartialType } from '@nestjs/mapped-types';
import Recipe from '../../entities/recipe.entity';

export class ForkRecipeDto extends PartialType(
    OmitType(Recipe, [
        'numberOfStar',
        'numberOfFork',
        'comments',
        'id',
        'forkFrom',
        'user',
        'stars',
        'createdAt',
        'updatedAt',
    ]),
) {
    constructor(parital: Partial<ForkRecipeDto>) {
        super();
        Object.assign(this, parital);
    }
}
