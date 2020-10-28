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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined', () => {
    expect(controller.getSignin).toBeDefined();
  });

  it('should be defined', () => {
    expect(controller.postSignin).toBeDefined();
  });

  it('should be defined', () => {
    expect(controller.signout).toBeDefined();
  });

  it('should be defined', () => {
    expect(controller.signup).toBeDefined();
  });
});
