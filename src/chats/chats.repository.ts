import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ChatsRepository {
  constructor(private prismaService: PrismaService) { }

  async create(userId: string) {
    const chatCreated = await this.prismaService.chat.create({
      data: {
        userId
      },
    });
    return chatCreated;
  }

  async findOne(id: string) {
    // Usando findUnique para garantir que estamos buscando um único chat
    try {
      const chat = await this.prismaService.chat.findFirst({
        where: {
          id,
        },
        include: {
          messages: true
        }
      });
      return chat?.messages
    } catch (error) {
      console.log(error);
    }
  }

  async findById(id: string) {
    // Usando findUnique para garantir que estamos buscando um único chat
    try {
      const chat = await this.prismaService.chat.findUnique({
        where: {
          id,
        }
      });
      return chat
    } catch (error) {
      console.log(error);
    }
  }

  async findByUser(id: string) {
    // Usando findUnique para garantir que estamos buscando um único chat
    try {
      const chat = await this.prismaService.chat.findFirst({
        where: {
          userId: id,
        },
        include: {
          messages: true
        }
      });
      console.log(chat);
      return chat
    } catch (error) {
      console.log(error);
      
    }
  }


}