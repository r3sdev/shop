import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../common/models';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
    ) { }

    async registerUser(email: string, password: string) {
      // TODO: save user to database
      // TODO: hash password
      // TODO: send email verification
    }

    async validateUser(email: string, password: string): Promise<Omit<User, 'password' > | null> {
      const user = await this.usersService.findOne(email);
      
      // TODO: Check hashed password instead of plain

      if (user && user.password === password) {
        const { password, ...result } = user;
        
        return new User(result);
      }
      return null;
    }

  async login(user: User) {
    const payload = { username: user.email, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}