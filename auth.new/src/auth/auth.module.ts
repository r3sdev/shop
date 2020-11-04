import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { ConfirmationController, ConfirmationService, ConfirmationModule } from './confirmation';
import { PasswordController, PasswordService, PasswordModule } from './password';
import { UsersModule } from '../users';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfirmationModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
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
