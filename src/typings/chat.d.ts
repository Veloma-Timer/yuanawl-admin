import { ChatContentType, MessageType } from "./enums";
import { User } from "@/typings/user";

export namespace ChatMessage {
  export interface IChatParams {
    content: string;
    contentType: ChatContentType;
    messageType: MessageType;
    sessionId: number;
    sendId: number;
    receiverId: number,
  }

  export interface ICreateSessionIdParams {
    sendId: number;
    receiverId: number,
    type: MessageType
  }

  export interface IMessageItem {
    content: string;
    contentType: number;
    createdTime: string;
    id: number;
    isDelete: string;
    messageType: number;
    receiverId: number;
    sendId: number;
    sessionId: number;
    updatedTime: string;
  }

  export interface IChatItem {
    session_id: number;
    receiver_id: number;
    send_id: number;
    message_id: number;
    content: string;
    is_not_read_count: string;
    message_time: string;
    user: User.IAppUser;
  }
}
