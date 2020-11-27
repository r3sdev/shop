import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfirmationController, ConfirmationService, ConfirmationModule } from './confirmation';
import { PasswordController, PasswordService, PasswordModule } from './password';
import { UsersModule } from '../users';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt-cookie.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfirmationModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: `${configService.get('jwt.expiration')}s`,
        },
      }),
    }),
    UsersModule,
    PasswordModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
  ],
  providers: [
    AuthService,
    ConfirmationService,
    JwtStrategy,
    LocalStrategy,
    PasswordService
  ],
  controllers: [
    AuthController,
    ConfirmationController,
    PasswordController,
  ],
})
export class AuthModule { }
