import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordController } from './password/password.controller';
import { ConfirmationController } from './confirmation/confirmation.controller';
import { ConfirmationService } from './confirmation/confirmation.service';
import { ConfirmationModule } from './confirmation/confirmation.module';
import { PasswordService } from './password/password.service';
import { PasswordModule } from './password/password.module';

@Module({
  providers: [AuthService, ConfirmationService, PasswordService],
  controllers: [AuthController, PasswordController, ConfirmationController],
  imports: [ConfirmationModule, PasswordModule]
})
export class AuthModule {}
