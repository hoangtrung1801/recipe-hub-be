import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export default class AuthController {
    @Get()
    get() {
        return 'hello world';
    }
}
