import { Injectable } from '@nestjs/common';
import { ChatsRepository } from './chats.repository';
import { Query } from 'express-serve-static-core'

@Injectable()
export class ChatsService {
  constructor(private chatsRepository: ChatsRepository ){}
  
  create() {
    return 'This action adds a new chat';
  }

  async findAll(query: Query) {
    return await this.chatsRepository.findAll(query);
  }

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
