import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../database';
import { UsersController, UsersService } from './';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: 'DATABASE_CONNECTION',
          useValue: {}
        },
        UsersService
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
