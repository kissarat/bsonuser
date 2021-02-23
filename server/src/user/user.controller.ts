import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { User, UserSearchable } from 'common/models/User';
import { Success } from 'common/dto/Success';
import { UserService } from './user.service';
import { PageResponse } from 'common/dto/PageResponse';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @Post()
    public async create(@Body() body: User) {
        const [user] = await this.userService.add(body)
        return new Success(user)
    }

    @Put(':id')
    public async update(@Param('id') id: number, @Body() body: User) {
        const items = await this.userService.updateBy('id', id, body)
        return new Success(items)
    }

    @Delete(':id')
    public async remove(@Param('id') id: number) {
        const modified = await this.userService.removeBy('id', id)
        if (0 === modified) {
            throw new NotFoundException(`User ${id} not found`)
        }
        return new Success()
    }

    @Get(':id')
    public async findById(@Param('id') id: number) {
        const [user] = await this.userService.findBy('id', id)
        if (!user) {
            throw new NotFoundException(`User ${id} not found`)
        }
        return new Success(user)
    }

    @Get()
    public async find(@Query('key') key: UserSearchable, @Query('value') value: string) {
        const items = await this.userService.findBy(key, value)
        return new PageResponse(items)
    }
}
