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
import {
    ApiBearerAuth,
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger/dist/decorators';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { RequestWithUser } from 'src/common/dto/request-with-user.dto';
import User from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/request/login.dto';
import { RegistrationDto } from './dto/request/registration.dto';
import { LoginSuccessDto } from './dto/response/login-success.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('auth')
export default class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Register user',
    })
    @ApiBody({
        type: RegistrationDto,
    })
    @ApiResponse({
        type: User,
    })
    register(@Body() registrationDto: RegistrationDto) {
        return this.authService.register(registrationDto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @ApiOperation({
        summary: 'Login user',
    })
    @ApiBody({
        type: LoginDto,
    })
    @ApiOkResponse({
        type: LoginSuccessDto,
    })
    async login(
        @Req() req: RequestWithUser,
        @Res({ passthrough: true }) res: Response,
        // @Body() loginDto: LoginDto,
    ): Promise<LoginSuccessDto> {
        const { cookie, accessToken } = await this.authService.login(req.user);
        res.setHeader('Set-Cookie', cookie);
        return {
            accessToken,
        };
    }

    @Post('logout')
    @ApiOperation({
        summary: 'Logout user',
    })
    @ApiOkResponse({
        description: 'Successfull',
    })
    @ApiBearerAuth()
    async logout(@Res({ passthrough: true }) res: Response) {
        const { cookie } = await this.authService.logout();
        res.setHeader('Set-Cookie', cookie);
    }

    @Get()
    @ApiOperation({
        summary: 'Get information of current user',
    })
    @ApiOkResponse({
        description: 'Successfull',
        type: User,
    })
    @ApiBearerAuth()
    getProfile(@Request() req: RequestWithUser) {
        return req.user;
    }
}
