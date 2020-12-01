import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users';
import { mockedJwtService } from '../../test/mocks/jwt.service';
import { PasswordService } from './password';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let app: INestApplication;

  const mockedUser = {
    id: 'test',
    email: "test@test.com",
    firstName: "John",
    lastName: "Test"
  }

  beforeEach(async () => {
    const mockJwtAuthGuard = jest.fn(() => true);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: ConfigService,
          useValue: ({
            get: () => 'test'
          })
        },
        {
          provide: 'DATABASE_CONNECTION',
          useValue: {}
        },
        {
          provide: JwtService,
          useValue: mockedJwtService
        },
        PasswordService,
        UsersService,
        AuthService,
        {
          provide: AuthService,
          useValue: ({
            getCookieWithJwtToken: () => 'Authentication=test-token; HttpOnly; Path=/; Max-Age=300',
            getCookieForLogOut: () => 'Authentication=; HttpOnly; Path=/; Max-Age=0',
            getAuthenticatedUser: () => (mockedUser),
            registerUser: () => (mockedUser),
          })
        },
        LocalStrategy,
        JwtStrategy
      ]
    })
      .overrideGuard(JwtAuthGuard).useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('/auth/login', () => {
    it('should be defined', () => {
      expect(controller.postLogin).toBeDefined();
    });

    it('handles the login of an existing user', async () => {

      const { id, ...user } = mockedUser

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          ...user,
          password: 'strongPassword'
        })
        .expect(200)
        .expect(mockedUser);

    })
  })

  describe('/auth/register', () => {
    it('should be defined', () => {
      expect(controller.postRegister).toBeDefined();
    });

    it('handles registering a new user', () => {
      const { id, ...user } = mockedUser

      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...user,
          password: 'strongPassword'
        })
        .expect(201)
        .expect(mockedUser);
    })
  })

  describe('/auth/logout', () => {
    it('should be defined', () => {
      expect(controller.deleteLogout).toBeDefined();
    });

    it('handles logging out the current user', () => {
      return request(app.getHttpServer())
        .delete('/auth/logout')
        .expect(204)
    })
  })

  describe('/auth/profile', () => {
    it('should be defined', () => {
      expect(controller.getProfile).toBeDefined();
    });

    it('handles showing the current user profile', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .expect(200)
    })
  })

});


