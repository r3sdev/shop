import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../common/models';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { hash } from 'bcrypt';
import { MongoDbErrorCode } from '../database/mongodb.error-codes.enum';
import { PasswordService } from './password';
import { configuration } from '../config';
import { SomethingWentWrongException, UserExistsException, WrongCredentialsException } from '../exception';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
  ) { }

  async registerUser(data: RegisterUserDto) {
    const { password, ...rest } = data;

    const hashedPassword = await hash(password, 10);

    try {
      const createdUser = await this.usersService.create({
        ...rest,
        password: hashedPassword
      });
      createdUser.password = undefined;

      return createdUser;
    } catch (error) {
      if (error?.code === MongoDbErrorCode.UniqueViolation) {
        throw new UserExistsException();
      }
      throw new SomethingWentWrongException(error.code);
    }

    // TODO: send email verification
  }

  async getAuthenticatedUser(email: string, plainTextPassword: string): Promise<Omit<User, 'password'> | null> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      await this.passwordService.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;

      return user;
    } catch (error) {
      throw new WrongCredentialsException();
    }
  }

  async loginUser(user: User) {
    const payload = { username: user.email, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  getCookieWithJwtToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${configuration().jwt.expiration}`;
  }

  getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}