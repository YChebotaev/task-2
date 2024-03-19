import { makeAutoObservable } from "mobx";
import type { Stream as StreamType } from "@task-2/service/types";

export class Stream implements StreamType {
  id: number
  title: string
  slug: string
  subscribed?: boolean

  constructor(stream: StreamType) {
    this.id = stream.id
    this.title = stream.title
    this.slug = stream.slug
    this.subscribed = stream.subscribed

    makeAutoObservable(this);
  }

  subscribe() {
    this.subscribed = true
  }

  unsubscribe() {
    this.subscribed = false
  }
}
