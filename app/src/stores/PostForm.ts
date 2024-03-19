import { makeAutoObservable } from "mobx";
import type { PostForm as PostFormType } from "@task-2/service/types";

export class PostForm implements PostFormType {
  id?: number
  title: string
  content: object
  tags: string[]

  constructor(post: PostFormType) {
    this.id = post.id
    this.title = post.title
    this.content = post.content
    this.tags = post.tags

    makeAutoObservable(this);
  }

  setTitle(title: string) {
    this.title = title
  }

  setContent(content: object) {
    this.content = content
  }

  setTags(tags: string[]) {
    this.tags = tags
  }
}
