import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ChatsRepository {
  constructor(private prismaService: PrismaService) { }

  async create(userId: string) {
    const chatCreated = await this.prismaService.chat.create({
      data: {
        senderId: userId,
      }
    })
    return chatCreated
  }

  async update() {
    // const messageUpdated = await this.prismaService.chat.update({
    //   where:{
    //     id:  chatId
    //   },
    //   data:{
        
    //   }
    // });

    // return messageUpdated;
  }

  async findOne(id: string) {
    const chat = await this.prismaService.chat.findFirst({
      where: {
        id
      },
      include:{
        messages: true
      }
    })
    console.log("CHAT", chat);
    
    return chat?.messages
  }

  async findBySenderOrReciver(userId: string) {
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

  async findAllById(id: string) {
    try {
      const allMessage = await this.prismaService.chat.findMany({
        where: {
          id
        },
        include:{
          messages: true
        }
      })
      console.log("FIND", allMessage);
      
      return allMessage
    } catch (error) {
      console.log(error);

    }
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