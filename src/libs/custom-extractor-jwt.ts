import { Request } from 'express';
import { JwtFromRequestFunction } from 'passport-jwt';

export default function customExtractor(req: Request): JwtFromRequestFunction {
    const authorization =
        (req.cookies && req.cookies['Authorization']
            ? req.cookies['Authorization'].split('Bearer ')[1]
            : null) ||
        (req.header && req.header('Authorization')
            ? req.header('Authorization').split('Bearer ')[1]
            : null);
    return authorization;
}
