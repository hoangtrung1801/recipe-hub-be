import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Request,
    Res,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { RequestWithUser } from 'src/common/dto/request-with-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/request/login.dto';
import { RegistrationDto } from './dto/request/registration.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('auth')
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
        @Body() loginDto: LoginDto,
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
