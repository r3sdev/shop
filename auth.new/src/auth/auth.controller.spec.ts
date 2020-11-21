import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users';
import { JwtService } from '@nestjs/jwt';
import { mockedJwtService } from '../../test/mocks/jwt.service';

jest.mock('@nestjs/config', () => jest.fn().mockResolvedValue(""))

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'DATABASE_CONNECTION',
          useValue: {}
        },
        UsersService,
        AuthService,
        // {
        //   provide: ConfigService,
        //   useValue: mockedConfigService
        // },
        {
          provide: JwtService,
          useValue: mockedJwtService
        },
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('postLogin should be defined', () => {
    expect(controller.postLogin).toBeDefined();
  });

  it('postRegister should be defined', () => {
    expect(controller.postRegister).toBeDefined();
  });

  it('deleteLogout should be defined', () => {
    expect(controller.deleteLogout).toBeDefined();
  });

  it('getProfile should be defined', () => {
    expect(controller.getProfile).toBeDefined();
  });

});


