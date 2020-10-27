import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users';

@Controller('auth/confirmation')
@ApiTags('auth/confirmation')
export class ConfirmationController {
    @Get('new')
    @ApiOperation({ summary: 'new_user_confirmation' })
    @ApiOkResponse({ type: User })
    @ApiForbiddenResponse({ description: 'Forbidden.' })

    async newUserConfirmation() {
        return "GET auth/confirmation/new"
    }

    @Get()
    @ApiOperation({ summary: 'user_confirmation show' })
    @ApiOkResponse({ type: User })
    @ApiForbiddenResponse({ description: 'Forbidden.' })

    async getUserConfirmation() {
        return "GET auth/confirmation"
    }

    @Post()
    @ApiOperation({ summary: 'user_confirmation create' })
    @ApiOkResponse({ description: 'The password has been successfully set.', type: User })
    @ApiForbiddenResponse({ description: 'Forbidden.' })

    async postUserConfirmation(@Body() user: User) {
        return "POST auth/confirmation"
    }
}
