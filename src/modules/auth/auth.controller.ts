import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Request,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/common/decorators/set-metadata.decorator';
import { RequestWithUser } from 'src/common/dto/request-with-user.dto';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/request/registration.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export default class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.OK)
    register(@Body() registrationDto: RegistrationDto) {
        return this.authService.register(registrationDto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    async login(
        @Req() req: RequestWithUser,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { cookie } = await this.authService.login(req.user);
        res.setHeader('Set-Cookie', cookie);
        // return req.user;
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        const { cookie } = await this.authService.logout();
        res.setHeader('Set-Cookie', cookie);
    }

    @Get()
    getProfile(@Request() req: RequestWithUser) {
        return req.user;
    }
}
