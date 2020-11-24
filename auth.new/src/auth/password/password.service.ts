import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';

@Injectable()
export class PasswordService {
    async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await compare(
            plainTextPassword,
            hashedPassword
        );
        if (!isPasswordMatching) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }
}
