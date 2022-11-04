import { BadRequestException } from '@nestjs/common';

export class ExistUserException extends BadRequestException {
    constructor(username: string) {
        super(`User with username ${username} existed`);
    }
}
