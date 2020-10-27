import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Db, FilterQuery, ObjectID } from 'mongodb';
import { Item } from './item.model';
import { ItemService as _ItemService } from './items.interface';

@Injectable()
export class ItemsService  {

  TABLE_NAME = 'items';

  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
  ) {}

  async find(): Promise<Item[]> {
    return await this.db.collection(this.TABLE_NAME).find({}).toArray();
  }

  async findOne(options: FilterQuery<Item>): Promise<Item> {
    if (!ObjectID.isValid(options.id)) {
      throw new BadRequestException;
    }

    const response = await this.db.collection(this.TABLE_NAME).findOne({
      _id: new ObjectID(options.id),
    });

    if (!response) {
      throw new NotFoundException;
    }

    return response;
  }

  async create(body: Item): Promise<void> {
    await this.db.collection(this.TABLE_NAME).insertOne(body);
  }

}
