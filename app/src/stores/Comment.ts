import { makeAutoObservable } from "mobx";
import type { Comment as CommentType } from "@task-2/service/types";

export class Comment implements CommentType {
  id: number
  postId: number
  authorId: number
  parentId: number
  content: object
  createdAt: string
  updatedAt: string

  constructor(post: CommentType) {
    this.id = post.id
    this.postId = post.postId
    this.authorId = post.authorId
    this.parentId = post.parentId
    this.content = post.content
    this.createdAt = post.createdAt
    this.updatedAt = post.updatedAt

    makeAutoObservable(this);
  }
}
