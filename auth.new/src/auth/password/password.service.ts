import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { WrongCredentialsException } from '../../exception';

@Injectable()
export class PasswordService {
    async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await compare(
            plainTextPassword,
            hashedPassword
        );
        if (!isPasswordMatching) {
            throw new WrongCredentialsException()
        }
    }
}
