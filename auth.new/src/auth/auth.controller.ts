import { Body, Controller, Delete, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse, ApiCreatedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { User } from '../common/models';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

type RequestWithUser = Request & {user: User}

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({ summary: 'Log in user' })
    @ApiOkResponse({ description: 'The user has successfully logged in.', type: User })
    @ApiForbiddenResponse({ description: 'Forbidden.' })

    async postLogin(@Request() req: RequestWithUser, @Body() _: LoginUserDto) {
        return this.authService.loginUser(req.user)
    }

    @Post('register')
    @ApiOperation({ summary: 'Register user' })
    @ApiCreatedResponse({ description: 'The user has successfully registered.', type: User })
    @ApiForbiddenResponse({ description: 'Forbidden.' })

    async postRegister(@Body() data: RegisterUserDto) {
        return this.authService.registerUser(data)
    }

    @Delete('logout')
    @ApiOperation({ summary: 'Log out user' })
    @ApiOkResponse({ description: 'The user has successfully logged out.', type: User })

    async deleteLogout(@Body() _: User) {
        return "DELETE logout"
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiOperation({ summary: 'User profile' })
    
    async getProfile(@Request() req: RequestWithUser) {
      return req.user;
    }

}
