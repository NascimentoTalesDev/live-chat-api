import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsRepository } from './chats.repository';
import { UsersRepository } from 'src/users/users.repository';
import { MessagesRepository } from 'src/messages/messages.repository';

interface Payload {
  newMessage: string;
  phone: string;
}

@WebSocketGateway(8001, { cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  constructor(
    private chatRepository: ChatsRepository,
    private usersRepository: UsersRepository,
    private messagesRepository: MessagesRepository,
  ) {}

  // Armazenando os clientes conectados
  private clients = new Map<
    string,
    {
      socket: Socket;
      role: 'client' | 'attendant';
      chatId?: string;
      name?: string;
      lastMessage?: string;
    }
  >();
  private clientsWithMessages = new Set<string>(); // Armazena os IDs dos clientes que já enviaram mensagens

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  @SubscribeMessage('msgToInitChat')
  async initChat(client: Socket, payload: { name: string; phone: string }) {
    console.log(payload);
    const userExists = await this.usersRepository.findByPhone(payload.phone);
    if (!userExists) {
      await this.usersRepository.create(payload);
    }
    // Atualiza o `client` com o `name` ao registrar o cliente
    const clientInfo = this.clients.get(client.id);
    if (clientInfo) {
      this.clients.set(client.id, { ...clientInfo, name: payload.name });
    }
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    const role = client.handshake.query.role; // 'attendant' ou 'client'

    if (role === 'attendant') {
      this.clients.set(client.id, { socket: client, role: 'attendant' });
      this.logger.log(`Atendente conectado: ${client.id}`);
    } else if (role === 'client') {
      this.clients.set(client.id, { socket: client, role: 'client' });
      this.logger.log(`Cliente conectado: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client.id);
  }

  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, payload: Payload) {
    const clientInfo = this.clients.get(client.id);
    console.log(payload);

    const userExists = await this.usersRepository.findByPhone(payload.phone);
    let chat;

    if (userExists) {
      chat = await this.chatRepository.findOne(userExists.id);
      if (!chat) {
        chat = await this.chatRepository.create(userExists.id);
      }
      await this.messagesRepository.create(chat.id, userExists.id, payload.newMessage);

      // Associar chatId, name e última mensagem ao cliente na estrutura `clients`
      if (clientInfo && clientInfo.role === 'client') {
        const updatedClientInfo = {
          ...clientInfo,
          chatId: chat.id,
          lastMessage: payload.newMessage,
        };
        this.clients.set(client.id, updatedClientInfo);
        // Adiciona o cliente ao conjunto de clientes com mensagens enviadas
        this.clientsWithMessages.add(client.id);

        const attendant = Array.from(this.clients.values()).find(
          (info) => info.role === 'attendant',
        );
        if (attendant) {
          attendant.socket.emit('msgToAttendant', {
            message: payload,
            clientId: client.id,
            chatId: chat.id,
            name: updatedClientInfo.name || `Cliente ${client.id}`,
            lastMessage: payload.newMessage, // Adiciona a última mensagem
          });

          // Filtra apenas os clientes que já enviaram mensagens
          const connectedClients = Array.from(this.clients.values())
            .filter(
              (info) =>
                info.role === 'client' &&
                this.clientsWithMessages.has(info.socket.id),
            )
            .map((info) => ({
              id: info.socket.id,
              name: info.name || `Cliente ${info.socket.id}`,
              chatId: info.chatId ?? 'Desconhecido', // Usa o chatId armazenado na estrutura `clients`
              lastMessage: info.lastMessage ?? '', // Envia a última mensagem, se disponível
            }));

          attendant.socket.emit('connectedClients', connectedClients);
        }
      }
    }
  }

  @SubscribeMessage('msgToClient')
  handleAttendantMessage(
    client: Socket,
    payload: { message: string; clientId: string },
  ): void {
    const attendantInfo = this.clients.get(client.id);
    if (attendantInfo && attendantInfo.role === 'attendant') {
      const clientInfo = this.clients.get(payload.clientId);
      if (clientInfo && clientInfo.role === 'client') {
        clientInfo.socket.emit('msgToClient', payload.message);
      }
    }
  }
}
