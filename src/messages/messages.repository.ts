import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MessagesRepository {
  constructor(private prismaService: PrismaService) { }

  async create(chatId: string, userId: string, msg: string) {
    const messageCreated = await this.prismaService.message.create({
      data: {
        chatId,
        userId,
        text: msg,
      }
    })
    return messageCreated
  }

  async update(id: string, userId: string, msg: string) {
    const messageUpdated = await this.prismaService.message.update({
      where:{
        id
      },
      data:{
        text:msg
      }  
    });

    return messageUpdated;
  }

  async findOne(userId: string) {
    const chatFinded = await this.prismaService.chat.findFirst({
      where: {
        OR:[
          {
            senderId: userId
          },
          {
            recieverId: userId
          },
        ]
      }
    })
    return chatFinded
  }

  findAll(client: string) {
    return "findAll"
  }

  async findAllByClient(client: string) {
    try {
      const allMessageClient = await this.prismaService.message.findMany({
        where: {
          userId: client
        }
      })
      return allMessageClient
    } catch (error) {
      console.log(error);

    }
  }
}