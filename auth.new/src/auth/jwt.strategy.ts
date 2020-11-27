import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from 'src/users';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies?.Authentication;
            }]),
            ignoreExpiration: false,
            secretOrKey: configService.get('jwt.secret'),
        });
    }

    async validate(payload: JwtPayload) {
        // Optional: Fetch user from database here and enrich the data
        // Optional: Check if token is not revoked in a list of revoked tokens

        console.log(payload)

        return this.usersService.findOneById(payload.userId)
    }
}