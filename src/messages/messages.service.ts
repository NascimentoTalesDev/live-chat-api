import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesRepository } from './messages.repository';
import { Query } from 'express-serve-static-core'

@Injectable()
export class MessagesService {

  constructor(private readonly messagesRepository: MessagesRepository) {}

  create(createMessageDto: CreateMessageDto) {
    return 'This action adds a new message';
  }

  async findAll(query: Query) {
    return await this.messagesRepository.findAll(query);
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
