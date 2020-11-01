import { Injectable } from '@nestjs/common';
import { Password } from 'src/services';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    try {
      const isValidPassword = await Password.compare(user?.password, pass);

      if (isValidPassword) {
        const { password, ...result } = user;

        return result;
      }

      return null;
    }
    catch {
      return null;
    }
  }
}