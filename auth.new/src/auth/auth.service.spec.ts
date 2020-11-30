import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users';
import { JwtService } from '@nestjs/jwt';
import { mockedJwtService, mockedPasswordService, mockedUsersService } from '../../test/mocks';
import { PasswordService } from './password';
import * as bcrypt from 'bcrypt';
import { UserExistsException, SomethingWentWrongException, WrongCredentialsException } from '../../src/exception';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let passwordService: PasswordService;

  beforeEach(async () => {
    // jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'DATABASE_CONNECTION',
          useValue: {}
        },
        {
          provide: UsersService,
          useValue: mockedUsersService
        },
        AuthService,
        {
          provide: PasswordService,
          useValue: mockedPasswordService
        },
        {
          provide: JwtService,
          useValue: mockedJwtService
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    passwordService
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('registerUser', () => {
    const data = {
      email: "test@test.com",
      firstName: "John",
      lastName: "Test",
      password: "password"
    }

    it('should be defined', async () => {
      expect(authService.registerUser).toBeDefined();
    })

    it('handles success', async () => {
      let bcryptHash: jest.Mock;
      bcryptHash = jest.fn().mockReturnValue("hashedpassword");
      (bcrypt.hash as jest.Mock) = bcryptHash;
  
      const result = await authService.registerUser(data)
  
      expect(bcryptHash).toHaveBeenCalledWith("password", 10)
  
      expect(usersService.create).toHaveBeenCalledWith({
        ...data,
        password: "hashedpassword"
      })
  
      expect(result).toEqual({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        id: "test"
      })
    })

    it('handle user exists error', async () => {
      try {
        await authService.registerUser(data);
      }
      catch (error) {
        expect(error instanceof UserExistsException).toBeTruthy()
      }
    })

    it('handle generic error', async () => {  
      try {
        await authService.registerUser(data);
      }
      catch (error) {
        expect(error instanceof SomethingWentWrongException).toBeTruthy()
      }
    })
  })


  describe('getAuthenticatedUser', () => {
    it('should be defined', () => {
      expect(authService.getAuthenticatedUser).toBeDefined();
    })

    it('handles success', async () => {
      const result = await authService.getAuthenticatedUser("test@test.com", "test")
  
      expect(result).toEqual({
        _id: "test",
        email: "test@test.com",
        firstName: "John",
        lastName: "Test",
        password: undefined
      })
    })

    it('handles errors', async () => {
      try {
        await authService.getAuthenticatedUser("test@test.com", "test")
      }
      catch (error) {
        expect(error instanceof WrongCredentialsException).toBeTruthy()
      }
    })

  })

  describe('getCookieWithJwtToken', () => {
    
    it('should be defined', () => {
      expect(authService.getCookieWithJwtToken).toBeDefined();
    })

    it('returns a cookie', () => {
      const cookie = authService.getCookieWithJwtToken("test");

      expect(cookie).toEqual("Authentication=signedPayload; HttpOnly; Path=/; Max-Age=600")
    })
  })

  describe('getCookieForLogOut', () => {
    it('should be defined', () => {
      expect(authService.getCookieForLogOut).toBeDefined();
    })

    it('clears the cookie', () => {
      const cookie = authService.getCookieForLogOut();

      expect(cookie).toEqual("Authentication=; HttpOnly; Path=/; Max-Age=0")
    })
  })


});
