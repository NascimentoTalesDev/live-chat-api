import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Query } from 'express-serve-static-core'

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
  
  async findAll(query: Query) {
    const messages = await this.prismaService.chat.findMany({
      where: {
        OR: [
          {
            User: {
              name: {
                contains: query.search_query as string,
                mode: 'insensitive'
              }
            }
          }
        ]
      },
      include:{
        User: true,
        messages: true
      },
      take: 10,
      orderBy: {
        User:{
          name: "asc"
        }
      } 
    });
    return messages;
  }

  async findOne(id: string) {
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
    try {
      const chat = await this.prismaService.chat.findFirst({
        where: {
          userId: id,
        },
        include: {
          messages: true
        }
      });
      return chat
    } catch (error) {
      console.log(error);
    }
  }


}