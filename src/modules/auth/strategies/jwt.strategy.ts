import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import constants from 'src/common/constants';
import customExtractor from 'src/libs/custom-extractor-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest: customExtractor,
            ignoreExpiration: false,
            secretOrKey: constants.secretKey,
        });
    }

    async validate(payload: any) {
        return { id: payload.sub, username: payload.username };
    }
}
