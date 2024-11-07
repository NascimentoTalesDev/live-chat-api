import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatsRepository } from './chats.repository';

@Injectable()
export class ChatsService {
  constructor(private chatsRepository: ChatsRepository ){}
  
  create() {
    return 'This action adds a new chat';
  }

  async findAllByClient(clientId: string) {
    return await this.chatsRepository.findAllByClient(clientId);
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: string) {
    return `This action updates a #${id} chat`;
  }

  remove(id: string) {
    return `This action removes a #${id} chat`;
  }
}
