import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Query } from 'express-serve-static-core'

@Injectable()
export class MessagesRepository {
  constructor(private prismaService: PrismaService) { }

  async create(chatId: string, text: string, sender: string) {
    const messageCreated = await this.prismaService.message.create({
      data: {
        chatId,
        text,
        sender
      }
    })
    return messageCreated
  }

  async findAll(query: Query) {
    const messages = await this.prismaService.message.findMany({
      where: {
        OR: [
          {
            sender: "attendant",
            text: {
              contains: query.search_query as string,
              mode: 'insensitive'
            }
          }
        ]
      },
      distinct: ['text'],
      orderBy: {
        text: 'asc'
      } 
    });
    return messages;
  }

  // async update(id: string, userId: string, msg: string) {
  //   const messageUpdated = await this.prismaService.message.update({
  //     where:{
  //       id
  //     },
  //     data:{
  //       text:msg
  //     }  
  //   });

  //   return messageUpdated;
  // }

  // async findOne(userId: string) {
  //   const chatFinded = await this.prismaService.chat.findFirst({
  //     where: {
  //       OR:[
  //         {
  //           senderId: userId
  //         },
  //         {
  //           recieverId: userId
  //         },
  //       ]
  //     }
  //   })
  //   return chatFinded
  // }

  async findAllByChatId(chatId: string) {
    try {
      const messages = await this.prismaService.message.findMany({
        where: {
          chatId
        }
      })
      return messages
    } catch (error) {
      console.log(error);
    }
  }
}