import { Injectable, NotFoundException } from "@nestjs/common";
import { allowedNodeEnvironmentFlags } from "process";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ChatsRepository {
  constructor(private prismaService: PrismaService) { }

  async create(client: string, msg: string) {
    const messageCreated = await this.prismaService.message.create({
      data: {
        userId: client,
        texts: [msg]
      }
    })
    return messageCreated
  }

  async update(clientId: string, msg: string) {
    const messageUpdated = await this.prismaService.message.update({
      where: {
        id: clientId,
      },
      data: {
        texts: {
          push: [msg],
        },
      },
    });

    return messageUpdated;
  }

  async findOne(client: string) {
    const messageFinded = await this.prismaService.message.findFirst({
      where: {
        userId: client
      }
    })
    return messageFinded
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