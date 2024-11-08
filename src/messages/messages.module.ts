import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessagesRepository } from './messages.repository';

@Module({
  controllers: [MessagesController],
  providers: [PrismaService, MessagesService, MessagesRepository],
})
export class MessagesModule {}
