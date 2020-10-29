import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfirmationController, ConfirmationService, ConfirmationModule } from './confirmation';
import { PasswordController, PasswordService, PasswordModule } from './password';
import { UsersModule } from '../users';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [ConfirmationModule, UsersModule, PasswordModule, PassportModule],
  providers: [AuthService, ConfirmationService, LocalStrategy, PasswordService],
  controllers: [AuthController, PasswordController, ConfirmationController],
})
export class AuthModule {}
