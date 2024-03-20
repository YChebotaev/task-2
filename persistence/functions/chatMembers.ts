import { createCreateOperation, createDeleteOperation, createFindOperation, createGetAllOperation, createGetOperation } from '../lib'
import type { ChatMember, ChatMemberFindProps, ChatMemberCreateProps } from '../types'
import { knex } from '../knex'

const baseChatMemberCreate = createCreateOperation<ChatMemberCreateProps>('chatMembers')

export const chatMemberCreate = async (props:
  & Omit<ChatMemberCreateProps, 'unreadCount'>
  & Partial<Pick<ChatMemberCreateProps, 'unreadCount'>>
) => {
  return baseChatMemberCreate({
    unreadCount: 0,
    ...props,
  })
}

export const chatMemberGet = createGetOperation<ChatMember>('chatMembers')

export const chatMembersGetAll = createGetAllOperation<ChatMember>('chatMembers')

export const chatMembersFind = createFindOperation<ChatMember, ChatMemberFindProps>('chatMembers')

export const chatMemberDelete = createDeleteOperation('chatMembers')

export const incrUnreadCount = async (id: number) => {
  const { unreadCount } = await knex
    .select('unreadCount')
    .from('chatMembers')
    .where('id', id)
    .first<Pick<ChatMember, 'unreadCount'>>()

  await knex('chatMembers')
    .update({ unreadCount: unreadCount + 1 })
    .where('id', id)
}

export const clearUnreadCount = async (id: number) => {
  await knex('chatMembers')
    .update({ unreadCount: 0 })
    .where('id', id)
}
