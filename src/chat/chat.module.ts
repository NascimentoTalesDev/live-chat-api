import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatsRepository } from './chat.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PrismaService, ChatGateway, ChatsRepository],
})
export class ChatModule {}
