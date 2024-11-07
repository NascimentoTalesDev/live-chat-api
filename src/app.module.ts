import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, ChatsModule],
})
export class AppModule {}
