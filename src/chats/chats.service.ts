import { Injectable } from '@nestjs/common';
import { ChatsRepository } from './chats.repository';

@Injectable()
export class ChatsService {
  constructor(private chatsRepository: ChatsRepository ){}
  
  create() {
    return 'This action adds a new chat';
  }

  // async findAllByClient(clientId: string) {
  //   return await this.chatsRepository.findAllByClient(clientId);
  // }

  async findOne(id: string) {
    return await this.chatsRepository.findOne(id);
  }

  update(id: string) {
    return `This action updates a #${id} chat`;
  }

  remove(id: string) {
    return `This action removes a #${id} chat`;
  }
}
