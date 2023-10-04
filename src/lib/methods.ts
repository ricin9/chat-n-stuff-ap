import { ElysiaWS } from "elysia/dist/ws";
import { getChatGroupIds } from "../modules/chat-group/chat-group.service";

export async function subscribeUserToChatGroups(
  userId: string,
  wsInstance: ElysiaWS<any, any>
) {
  const chatGroupIds = await getChatGroupIds(userId);
  for (const chatGroupId of chatGroupIds) {
    wsInstance.subscribe(chatGroupId);
  }
}
