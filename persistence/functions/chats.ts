import { createCreateOperation, createDeleteOperation, createFindOperation, createGetAllOperation, createGetOperation } from '../lib'
import type { Chat, ChatCreateProps, ChatFindProps } from '../types'

export const chatCreate = createCreateOperation<ChatCreateProps>('chats')

export const chatGet = createGetOperation<Chat>('chats')

export const chatsGetAll = createGetAllOperation<Chat>('chats')

export const chatsFind = createFindOperation<Chat, ChatFindProps>('chats')

export const chatDelete = createDeleteOperation('chats')
