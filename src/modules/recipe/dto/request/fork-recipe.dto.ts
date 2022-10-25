import { PartialType, PickType } from '@nestjs/swagger';
import Recipe from '../../entities/recipe.entity';

export class ForkRecipeDto extends PartialType(
    PickType(Recipe, ['name', 'description', 'mode']),
) {
    constructor(parital: Partial<ForkRecipeDto>) {
        super();
        Object.assign(this, parital);
    }
}
