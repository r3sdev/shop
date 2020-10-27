import { Controller, Get, Post, Param, Body, Response } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { FilterQuery } from 'mongodb';
import { Item } from './item.model';

@Controller('items')
@ApiTags('items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) { }

    @Get()
    @ApiResponse({type: Item, isArray: true, status: 200})
    @ApiResponse({ status: 403, description: 'Forbidden.'})

    async findAll(): Promise<Item[]> {
        return await this.itemsService.find()
    }

    @Get(':id')
    @ApiResponse({type: Item || undefined, status: 200})
    @ApiResponse({ status: 403, description: 'Forbidden.'})

    async findById(@Param() param: FilterQuery<any>): Promise<Item | undefined> {
        return this.itemsService.findOne(param.id)
    }

    @Post()
    @ApiResponse({ status: 201, description: 'The record has been successfully created.', type: Item })
    @ApiResponse({ status: 403, description: 'Forbidden.'})

    async create(@Body() item: Item): Promise<Item> {
        await this.itemsService.create(item);

        return item
    }
}