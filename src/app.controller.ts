import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
@ApiTags('Home')
@ApiBearerAuth()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @Public()
    getHello(): string {
        return this.appService.getHello();
    }
}
