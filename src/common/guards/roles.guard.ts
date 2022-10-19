import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import User from 'src/modules/user/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import Role from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) {
            return true;
        }
        const { user }: { user: User } = context.switchToHttp().getRequest();

        return requiredRoles.includes(user.role);
    }
}
