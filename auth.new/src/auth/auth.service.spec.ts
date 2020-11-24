import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users';
import { JwtService } from '@nestjs/jwt';
import { mockedJwtService } from '../../test/mocks/jwt.service';
import { PasswordService } from './password';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'DATABASE_CONNECTION',
          useValue: {}
        },
        UsersService, 
        AuthService,
        PasswordService,
        {
          provide: JwtService,
          useValue: mockedJwtService
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
