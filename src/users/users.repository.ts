import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersRepository {
  constructor(private prismaService: PrismaService) { }

  async create(createUserDto: CreateUserDto ) {
    console.log("CREATE USER",createUserDto);
    const { name, phone } = createUserDto
    const user = await this.prismaService.user.create({
      data: {
        name,
        phone
      }
    })
    return user
  }

  async update(clientId: string, msg: string) {
    // const messageUpdated = await this.prismaService.message.update({
      
    // });

    // return messageUpdated;
  }

  async findByPhone(phone: string) {
    const userFinded = await this.prismaService.user.findFirst({
      where: {
        phone
      }
    })
    return userFinded
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