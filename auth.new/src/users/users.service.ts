import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Db, FilterQuery, ObjectID } from 'mongodb';
import { User } from '../common/models';
import { UsersService as _UsersService } from './users.interface';

@Injectable()
export class UsersService  {

  COLLECTION_NAME = 'users';

  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
  ) {}

  async find(): Promise<User[]> {
    return await this.db.collection(this.COLLECTION_NAME).find({}).toArray();
  }

  async findOne(options: FilterQuery<User>): Promise<User> {
    if (!ObjectID.isValid(options.id)) {
      throw new BadRequestException;
    }

    const response = await this.db.collection(this.COLLECTION_NAME).findOne({
      _id: new ObjectID(options.id),
    });

    if (!response) {
      throw new NotFoundException;
    }

    return response;
  }

  async create(body: User): Promise<void> {
    await this.db.collection(this.COLLECTION_NAME).insertOne(body);
  }

}
