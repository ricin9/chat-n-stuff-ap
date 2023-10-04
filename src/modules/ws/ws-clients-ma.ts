// TODO: save sessions in redis

import { ElysiaWS } from "elysia/dist/ws";

type WsClient = ElysiaWS<any>;

const wsClients = new Map<string, WsClient>();

export function addClient(userId: string, wsClient: WsClient) {
  wsClients.set(userId, wsClient);
}

export function getClient(userId: string): WsClient | undefined {
  return wsClients.get(userId);
}

export function removeClient(userId: string) {
  wsClients.delete(userId);
}

export function subscribeUsersToChatGroup(
  chatGroupId: string,
  users: string[]
) {
  for (const user of users) {
    const client = getClient(user);
    if (client) {
      client.subscribe(chatGroupId);
    }
  }
}
