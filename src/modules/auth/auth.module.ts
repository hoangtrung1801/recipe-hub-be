import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import constants from 'src/common/constants';
import { UserModule } from '../user/user.module';
import AuthController from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            signOptions: {
                expiresIn: '1d',
            },
            secret: constants.secretKey,
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
    exports: [],
})
export class AuthModule {}
