import { BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';

export class UserNotExistException extends BadRequestException {
    constructor(usernameOrId: string) {
        if (isUUID(usernameOrId))
            super(`User with id ${usernameOrId} does not exist`);
        else super(`User with username ${usernameOrId} does not exist`);
    }
}
