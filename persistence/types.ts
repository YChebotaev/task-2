export type UserStreamSubscriptionType = 'user' | 'stream' | 'tag'
export type PostStreamRelationType = 'user' | 'stream' | 'tag'
export type ChatMemberType = 'initiator' | 'recepient'

export type Pagination = {
  limit: number
  offset: number
}

export type Paginated<T> = {
  total: number
  items: T[]
}

export type User = {
  id: number
  username: string
  email: string
  coverSrc: string
  avatarSrc: string
  passwordHash: string
  passwordSalt: string
}

export type UserCreateProps = Omit<User, 'id'>

export type UserFindProps = Partial<Pick<User, 'username' | 'email'>>


export type UserSession = {
  id: number
  userId: number
  accessToken: string
  refreshToken: string
}

export type UserSessionCreateProps = Omit<UserSession, 'id' | 'accessToken' | 'refreshToken'>

export type UserSessionFindProps = Partial<Pick<UserSession, 'userId' | 'accessToken'>>


export type Stream = {
  id: number
  title: string
  slug: string
}

export type StreamCreateProps = Omit<Stream, 'id'>

export type StreamFindProps = Partial<Pick<Stream, 'title' | 'slug'>>


export type Post = {
  id: number
  authorId: number
  title: string
  content: object
  createdAt: number
  updatedAt: number
}

export type PostCreateProps = Omit<Post, 'id' | 'updatedAt'>

export type PostFindProps = Pick<Post, 'authorId'>


export type Comment = {
  id: number
  postId: number
  authorId: number
  parentId: number
  content: object
  createdAt: number
  updatedAt: number
}

export type CommentCreateProps =
  & Omit<Comment, 'id' | 'updatedAt' | 'parentId'>
  & Partial<Pick<Comment, 'parentId'>>

export type CommentFindProps = Partial<Pick<Comment, 'postId' | 'authorId' | 'parentId'>>


export type Chat = {
  id: number
  createdAt: number
  updatedAt: number
}

export type ChatCreateProps = Omit<Chat, 'id' | 'updatedAt'>

export type ChatFindProps = {}


export type ChatMember = {
  id: number
  chatId: number
  userId: number
  type: ChatMemberType
}

export type ChatMemberCreateProps = Omit<ChatMember, 'id'>

export type ChatMemberFindProps = Partial<Pick<ChatMember, 'chatId' | 'userId' | 'type'>>


export type DirectMessage = {
  id: number
  chatId: number
  authorId: number
  content: object
  createdAt: number
  updatedAt: number
}

export type DirectMessageCreateProps = Omit<DirectMessage, 'id' | 'updatedAt'>

export type DirectMessageFindProps = Partial<Pick<DirectMessage, 'chatId'>>


export type UserStreamSubscription = {
  id: number
  userId: number
  streamId: number
  type: UserStreamSubscriptionType
}

export type UserStreamSubscriptionCreateProps = Omit<UserStreamSubscription, 'id'>

export type UserStreamSubscriptionFindProps = Partial<Pick<UserStreamSubscription, 'userId' | 'streamId' | 'type'>>


export type PostStreamRelation = {
  id: number
  postId: number
  streamId: number
  type: PostStreamRelationType
}

export type PostStreamRelationCreateProps = Omit<PostStreamRelation, 'id'>

export type PostStreamRelationFindProps = Partial<Pick<PostStreamRelation, 'postId' | 'streamId' | 'type'>>


export type Upload = {
  id: number
  filename: string
}

export type UploadCreateProps = Omit<Upload, 'id'>
