import { makeAutoObservable } from "mobx";
import type { User as UserType } from "@task-2/service/types";

export class User implements UserType {
  id: number;
  username: string;
  avatarSrc: string;
  coverSrc: string;
  subscribed?: boolean;

  constructor(user: UserType) {
    this.id = user.id;
    this.username = user.username
    this.avatarSrc = user.avatarSrc
    this.coverSrc = user.coverSrc
    this.subscribed = user.subscribed

    makeAutoObservable(this);
  }

  subscribe() {
    this.subscribed = true
  }

  unsubscribe() {
    this.subscribed = false
  }
}
