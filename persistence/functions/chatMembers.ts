import { createCreateOperation, createDeleteOperation, createFindOperation, createGetAllOperation, createGetOperation } from '../lib'
import type { ChatMember, ChatMemberFindProps, ChatMemberCreateProps } from '../types'

export const chatMemberCreate = createCreateOperation<ChatMemberCreateProps>('chatMembers')

export const chatMemberGet = createGetOperation<ChatMember>('chatMembers')

export const chatMembersGetAll = createGetAllOperation<ChatMember>('chatMembers')

export const chatMembersFind = createFindOperation<ChatMember, ChatMemberFindProps>('chatMembers')

export const chatMemberDelete = createDeleteOperation('chatMembers')
