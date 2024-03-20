import http from "@/api";
import {ChatMessage} from "@/typings/chat";

const baseUrl = "/app_chat_message"

/**
 * 创建对话id
 * @param data
 * @returns
 */
export function createSessionId(data: ChatMessage.ICreateSessionIdParams) {
  return http.post<number>(baseUrl + "/session_id", data)
  // return request<number>({
  //   url: `${OUT_URL}/app_chat_message/session_id`,
  //   method: 'POST',
  //   data
  // })
}

/**
 * 获取对话内容列表
 * @param { number } sessionId
 * @returns
 */
export function getMessageList(sessionId: number) {
  return http.get<ChatMessage.IMessageItem[]>(baseUrl + "/messages?sessionId=" + sessionId, { noLoading: true })
  // return request<ChatMessage.IMessageItem[]>({
  //   url: OUT_URL + '/app_chat_message/messages?sessionId=' + sessionId,
  //   method: "GET",
  // })
}

/**
 * 获取消息列表
 * @param receiverId
 * @returns
 */
export function getChatList(params: { receiverId: number; handleCustomerServiceId: number }) {
  return http.get<ChatMessage.IChatItem[]>(baseUrl + "/chat_list", params, {noLoading: true})
}

export function handleChat(data: { sessionId: number; handleCustomerServiceId: number }) {
  return http.post(baseUrl + "/handle_chat", data, {noLoading: true});
}

// /**
//  * 设置未读
//  * @param messageId
//  * @returns
//  */
// export function signMessageUnRead(messageId: number) {
//   return request({
//     url: OUT_URL + "/app_chat_message/sign_un_read/" + messageId,
//     method: "PUT"
//   })
// }

// /**
//  * 设置已读
//  * @param data
//  * @returns
//  */
export function signMessageRead(data: { sessionId: number; receiverId: number }) {
  return http.put(baseUrl + "/sign_read", data, { noLoading: true })
}

/**
 * 删除消息
 * @param data
 * @returns
 */
export function delChat(data: { sessionIds: number[]; userId: number }) {
  return http.delete(baseUrl + "/chat_delete", data)

}
