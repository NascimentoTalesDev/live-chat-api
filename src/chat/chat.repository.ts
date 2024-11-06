import { Injectable, NotFoundException } from "@nestjs/common";
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
            id: clientId, // Certifique-se de que o client é convertido corretamente para string
          },
          data: {
            texts: {
              push: [msg], // Adiciona o novo texto ao array existente
            },
          },
        });
      
        return messageUpdated;
      }

    async findOne(client: string) {
        const messageFinded = await this.prismaService.message.findFirst({
            where:{
                userId: client
            }
        })
        return messageFinded
    }

    async findAll(client: string) {
        const messageFinded = await this.prismaService.message.findFirst({
            where:{
                userId: client
            }
        })
        return messageFinded
    }
}