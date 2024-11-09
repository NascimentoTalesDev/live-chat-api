import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Query as ExpressQuery } from 'express-serve-static-core'

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  async findAll(@Query() query: ExpressQuery) {    
    return await this.chatsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {    
    return this.chatsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.chatsService.update(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatsService.remove(id);
  }
}
