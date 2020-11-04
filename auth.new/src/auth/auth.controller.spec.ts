import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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
