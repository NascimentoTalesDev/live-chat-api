import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log("FINDONE", id);
    
    return this.chatsService.findOne(id);
  }

  @Get('all/:id')
  async findAllByClient(@Param('id') id: string) {
    return await this.chatsService.findAllByClient(id);
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
