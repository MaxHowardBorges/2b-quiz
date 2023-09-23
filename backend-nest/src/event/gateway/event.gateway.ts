import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('EventGateway');

  sendMessage(eventName: any, payload: any): void {
    this.logger.log(`Message send: ${eventName} ${payload}`);
    this.server.emit(eventName, payload);
  }

  handleConnection(client: any, ...args: any[]): void {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }

  handleDisconnect(client: any): void {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }
}
