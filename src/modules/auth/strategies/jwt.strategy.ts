import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import customExtractor from 'src/libs/custom-extractor-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest: customExtractor,
            ignoreExpiration: false,
            secretOrKey: configService.get('secretKey'),
        });
    }

    async validate(payload: any) {
        return { id: payload.sub, username: payload.username };
    }
}
