import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { User } from '../common/models';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @ApiOperation({ summary: 'Create user' })
    @ApiResponse({ status: 201, description: 'The record has been successfully created.', type: User })
    @ApiResponse({ status: 403, description: 'Forbidden.'})

    async create(@Body() user: CreateUserDto): Promise<User> {
        return this.usersService.create(user);
    }
}