import type { UserStreamSubscriptionType } from '@task-2/persistence'

export type FastifyError = {
  statusCode: number
  code: string
  error: string
  message: string
}

export type SignupResult = {
  accessToken: string
}

export type SigninResult = {
  accessToken: string
}

export type Paginated<T> = {
  total: number
  items: T[]
}

export type User = {
  id: number
  username: string
  avatarSrc: string
  coverSrc: string
  subscribed?: boolean
}

export type UserProfile = {
  id: number
  bio: string
  firstName: string
  lastName: string
  dateOfBirth: number
  country: string
  city: string
}

export type Stream = {
  id: number
  title: string
  slug: string
  subscribed?: boolean
}

export type Tag = {
  id: number
  title?: string
  slug?: string
}

export type Post = {
  id: number
  authorId: number
  title: string
  content: object
  tags: Tag[]
  subscribed?: boolean
  commentsCount: number
  createdAt: string
  updatedAt: string
}

export type PostForm = {
  id?: number
  title: string
  content: object
  tags: string[]
}

export type Comment = {
  id: number
  postId: number
  authorId: number
  parentId: number
  content: object
  createdAt: string
  updatedAt: string
}

export type Chat = {
  id: number
  initiator: User
  recepient: User
  unreadCount: number
  createdAt: number
  updatedAt: number
}

export type DirectMessage = {
  id: number
  chatId: number
  authorId: number
  content: object
  createdAt: number
  updatedAt: number
}

export type MySubscription = {
  id: number
  title?: string
  slug?: string
}

export type MySubscriptionsResult = {
  [key in UserStreamSubscriptionType]?: MySubscription[]
}
