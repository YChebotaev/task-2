import { makeAutoObservable } from "mobx";
import type { Post as PostType, Tag } from "@task-2/service/types";

export class Post implements PostType {
  id: number
  authorId: number;
  title: string
  content: object
  tags: Tag[]
  subscribed?: boolean;
  commentsCount: number;
  createdAt: string
  updatedAt: string

  constructor(post: PostType) {
    this.id = post.id
    this.authorId = post.authorId
    this.title = post.title
    this.content = post.content
    this.tags = post.tags
    this.subscribed = post.subscribed
    this.commentsCount = post.commentsCount
    this.createdAt = post.createdAt
    this.updatedAt = post.updatedAt

    makeAutoObservable(this);
  }

  subscribe() {
    this.subscribed = true
  }

  unsubscribe() {
    this.subscribed = false
  }
}
