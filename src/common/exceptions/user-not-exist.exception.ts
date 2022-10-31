import { BadRequestException } from '@nestjs/common';

export class UserNotExistException extends BadRequestException {
    constructor(username: string) {
        super(`User with username ${username} does not exist`);
    }
}
