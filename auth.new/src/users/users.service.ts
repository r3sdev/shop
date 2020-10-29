import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { User } from '../common/models';

@Injectable()
export class UsersService  {
  constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

  async findOne(email: string): Promise<User | undefined> {
    return  await this.db.collection('users').findOne({
      email
    });
  }


}
