import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiOkResponse, ApiCreatedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { User } from '../common/models';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
 
    @Get('signin')
    @ApiOperation({ summary: 'Current user session' })
    @ApiResponse({ type: User, isArray: false, status: 200 })
    @ApiResponse({ status: 403, description: 'Forbidden.' })

    async getSignin() {
        return "GET signin"
    }

    @Post('signin')
    @ApiOperation({ summary: 'Sign in user' })
    @ApiOkResponse({ description: 'The user has successfully signed in.', type: User })
    @ApiForbiddenResponse({ description: 'Forbidden.' })

    async postSignin(@Body() user: User) {
        return "POST signin"
    }

    @Post('signup')
    @ApiOperation({ summary: 'Sign up user' })
    @ApiCreatedResponse({ description: 'The user has successfully signed up.', type: User })
    @ApiForbiddenResponse({ description: 'Forbidden.' })

    async signup(@Body() user: User) {
        return "POST signup"
    }

    @Delete('signout')
    @ApiOperation({ summary: 'Sign out user' })
    @ApiOkResponse({ description: 'The user has successfully signed out.', type: User })

    async signout(@Body() user: User) {
        return "DELETE signout"
    }

}
