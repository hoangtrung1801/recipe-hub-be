import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import AuthController from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import constants from 'src/common/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: constants.secretKey,
            signOptions: {
                expiresIn: '1d',
            },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        LocalAuthGuard,
        JwtStrategy,
        JwtAuthGuard,
    ],
})
export class AuthModule {}
