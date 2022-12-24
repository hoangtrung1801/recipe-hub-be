import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { IConfigration } from 'src/common/configurations';
import customExtractor from 'src/libs/custom-extractor-jwt';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService<IConfigration>,
        private readonly userService: UserService,
    ) {
        super({
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest: customExtractor,
            ignoreExpiration: false,
            secretOrKey: configService.get('secretKey'),
        });
    }

    async validate(payload: any) {
        console.log('validate', payload);
        const data = { id: payload.sub, username: payload.username };
        const user = await this.userService.findOne(data.id);
        return user;
    }
}
