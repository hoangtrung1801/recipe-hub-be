import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserNotExistException } from 'src/common/exceptions/user-not-exist.exception';
import User from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { RegistrationDto } from './dto/request/registration.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async register(registrationDto: RegistrationDto) {
        const { username, password } = registrationDto;
        const existUser =
            this.userService.findOneByUsernameNotException(username);

        if (!existUser) throw new UserNotExistException(username);

        const hashedPassword = await this.hashPassword(password);
        registrationDto.password = hashedPassword;

        const user = await this.userService.create(registrationDto);
        return user;
    }

    async validateUser(username: string, password: string) {
        const user: User = await this.userService.findOneByUsernameNotException(
            username,
        );

        if (!user) throw new UserNotExistException(username);

        await this.verifyPassword(user.password, password);

        return user;
    }

    async login(user: User) {
        const { username, id } = user;
        // await this.userService.findOneByUsername(username);

        const payload = {
            username,
            sub: id,
        };

        const accessToken = this.jwtService.sign(payload);
        const cookie = `Authorization=Bearer ${accessToken}; Max-Age=1d; Path=/`;

        return {
            cookie,
            accessToken,
        };
    }

    async logout() {
        const cookie =
            'Authorization=; HttpOnly; Path=/; Secure; SameSite=None';

        return {
            cookie,
        };
    }

    async verifyPassword(password: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(
            hashedPassword,
            password,
        );
        if (!isPasswordMatching) {
            throw new BadRequestException('Wrong password');
        }
        return isPasswordMatching;
    }

    async hashPassword(password: string) {
        return await bcrypt.hash(password, 10);
    }
}
