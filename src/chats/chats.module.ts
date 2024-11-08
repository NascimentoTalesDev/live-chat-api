import { Module } from '@nestjs/common';
import { ChatGateway } from './chats.gateway';
import { ChatsRepository } from './chats.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatsService } from './chats.service';
import { UsersRepository } from 'src/users/users.repository';
import { MessagesRepository } from 'src/messages/messages.repository';
import { ChatsController } from './chats.controller';

@Module({
  controllers: [ChatsController],
  providers: [PrismaService, ChatGateway, ChatsRepository, ChatsService, UsersRepository, MessagesRepository],
})
export class ChatsModule {}
