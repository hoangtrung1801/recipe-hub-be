import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
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
        const hashedPassword = await bcrypt.hash(registrationDto.password, 10);
        registrationDto.password = hashedPassword;
        try {
            const user = await this.userService.create(registrationDto);
            return user;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    async validateUser(username: string, password: string) {
        try {
            const user: User = await this.userService.findOneByUsername(
                username,
            );
            await this.verifyPassword(user.password, password);
            delete user.password;
            return user;
        } catch {
            throw new HttpException(
                'Wrong credential provied',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async login(user: User) {
        const payload = {
            username: user.username,
            sub: user.id,
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
            throw new HttpException(
                'Wrong credential provied',
                HttpStatus.BAD_REQUEST,
            );
        }
        return isPasswordMatching;
    }
}
