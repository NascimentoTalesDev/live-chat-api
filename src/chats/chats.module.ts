import { Module } from '@nestjs/common';
import { ChatGateway } from './chats.gateway';
import { ChatsRepository } from './chats.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatsService } from './chats.service';

@Module({
  providers: [PrismaService, ChatGateway, ChatsRepository, ChatsService],
})
export class ChatsModule {}
