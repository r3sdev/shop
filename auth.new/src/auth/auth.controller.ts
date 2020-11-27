import { Body, Controller, Delete, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiTags, ApiOkResponse, ApiCreatedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { User } from '../common/models';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import type { RequestWithUser } from './interface/request-with-user.interface';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({ summary: 'Log in user' })
    @ApiOkResponse({ description: 'The user has successfully logged in.', type: User })
    @ApiForbiddenResponse({ description: 'Forbidden.' })

    async postLogin(@Req() req: RequestWithUser, @Res() res: Response, @Body() _: LoginUserDto) {
        const { user } = req;
        const cookie = this.authService.getCookieWithJwtToken(user._id);
        res.setHeader('Set-Cookie', cookie);
        user.password = undefined;

        return res.send(user)
    }

    @Post('register')
    @ApiOperation({ summary: 'Register user' })
    @ApiCreatedResponse({ description: 'The user has successfully registered.', type: User })
    @ApiForbiddenResponse({ description: 'Forbidden.' })

    async postRegister(@Body() data: RegisterUserDto) {
        return this.authService.registerUser(data)
    }

    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @Delete('logout')
    @ApiOperation({ summary: 'Log out user' })
    @ApiOkResponse({ description: 'The user has successfully logged out.', type: User })

    async deleteLogout(@Res() res: Response) {
        res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
        return res.sendStatus(200);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiOperation({ summary: 'User profile' })

    async getProfile(@Req() req: RequestWithUser) {
        return new User(req.user).toJSON();
    }

}
