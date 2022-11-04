import { BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';

export class NotExistRecipeException extends BadRequestException {
    constructor(usernameOrId: string) {
        if (isUUID(usernameOrId))
            super(`Recipe with id ${usernameOrId} does not exist`);
        super(`Recipe with username ${usernameOrId} does not exist`);
    }
}
