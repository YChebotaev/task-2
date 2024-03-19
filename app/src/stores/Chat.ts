import { makeAutoObservable } from "mobx";
import { User } from './User'
import type { Chat as ChatType } from "@task-2/service/types";

export class Chat implements ChatType {
  id: number
  initiator: User
  recepient: User
  createdAt: number
  updatedAt: number

  constructor(chat: ChatType) {
    this.id = chat.id
    this.initiator = new User(chat.initiator)
    this.recepient = new User(chat.recepient)
    this.createdAt = chat.createdAt
    this.updatedAt = chat.updatedAt

    makeAutoObservable(this);
  }
}
