import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfirmationController, ConfirmationService, ConfirmationModule } from './confirmation';
import { PasswordController, PasswordService, PasswordModule } from './password';
import { UsersModule } from '../users';

@Module({
  imports: [ConfirmationModule, UsersModule, PasswordModule],
  providers: [AuthService, ConfirmationService, PasswordService],
  controllers: [AuthController, PasswordController, ConfirmationController],
})
export class AuthModule {}
