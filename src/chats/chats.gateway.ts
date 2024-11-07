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

@WebSocketGateway(8001, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');
  constructor(private chatRepository: ChatsRepository) { }
  // Armazenando os clientes conectados
  private clients = new Map<string, { socket: Socket; role: 'client' | 'attendant'; room?: string }>();
  private clientsWithMessages = new Set<string>(); // Armazena os IDs dos clientes que já enviaram mensagens

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
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
  async handleMessage(client: Socket, payload: string) {
    const clientInfo = this.clients.get(client.id);
    const chatExists = await this.chatRepository.findOne(client.id);
    if (chatExists) {
      await this.chatRepository.update(chatExists.id, payload);
    } else {
      await this.chatRepository.create(client.id, payload);
    }

    if (clientInfo && clientInfo.role === 'client') {
      this.logger.log(`Mensagem recebida do cliente ${client.id}: ${payload}`);

      // Adiciona o cliente ao conjunto de clientes com mensagens enviadas
      this.clientsWithMessages.add(client.id);

      const attendant = Array.from(this.clients.values()).find(
        (info) => info.role === 'attendant',
      );
      if (attendant) {
        attendant.socket.emit('msgToAttendant', {
          message: payload,
          clientId: client.id,
        });

        // Filtra apenas os clientes que já enviaram mensagens
        const connectedClients = Array.from(this.clients.values())
          .filter((info) => info.role === 'client' && this.clientsWithMessages.has(info.socket.id))
          .map((info) => ({
            id: info.socket.id,
            name: `Cliente ${info.socket.id}`,
          }));
        attendant.socket.emit('connectedClients', connectedClients);
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

  // Nova função para obter os clientes conectados
  // @SubscribeMessage('getConnectedClients')
  // getConnectedClients(client: Socket): void {
  // Filtra apenas os clientes (não atendentes)
  // const connectedClients = Array.from(this.clients.values())
  //   .filter((info) => info.role === 'client')
  //   .map((info) => ({
  //     id: info.socket.id,
  //     name: `Cliente ${info.socket.id}`,
  //   }));

  // client.emit('connectedClients', connectedClients);
  // }
}
