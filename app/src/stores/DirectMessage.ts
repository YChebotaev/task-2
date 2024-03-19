import { makeAutoObservable } from "mobx";
import type { DirectMessage as DirectMessageType } from "@task-2/service/types";

export class DirectMessage implements DirectMessageType {
  id: number
  chatId: number
  authorId: number
  content: object
  createdAt: number
  updatedAt: number

  constructor(directMessage: DirectMessageType) {
    this.id = directMessage.id
    this.chatId = directMessage.chatId
    this.authorId = directMessage.authorId
    this.content = directMessage.content
    this.createdAt = directMessage.createdAt
    this.updatedAt = directMessage.updatedAt

    makeAutoObservable(this);
  }
}
