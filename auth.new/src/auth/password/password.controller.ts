import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../../common/models';

@Controller('auth/password')
@ApiTags('auth/password')
export class PasswordController {

    @Get('new')
    @ApiOperation({ summary: 'new_user_password' })
    @ApiOkResponse({ type: User })
    @ApiForbiddenResponse({ description: 'Forbidden.' })

    async getPasswordNew() {
        return "GET auth/password/new"
    }

    @Get('edit')
    @ApiOperation({ summary: 'edit_user_password' })
    @ApiOkResponse({ type: User })
    @ApiForbiddenResponse({ description: 'Forbidden.' })

    async getPasswordEdit() {
        return "GET auth/password/edit"
    }

    @Put()
    @ApiOperation({ summary: 'user_password update' })
    @ApiOkResponse({ description: 'The password has been succesfully updated.', type: User })
    @ApiForbiddenResponse({ description: 'Forbidden.' })

    async putPassword(@Body() _: User) {
        return "PUT auth/password"
    }

    @Post()
    @ApiOperation({ summary: 'user_password create' })
    @ApiOkResponse({ description: 'The password has been successfully set.', type: User })
    @ApiForbiddenResponse({ description: 'Forbidden.' })

    async postPassword(@Body() _: User) {
        return "POST auth/password"
    }
}
