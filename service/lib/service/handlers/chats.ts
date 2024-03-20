import { errorCodes } from "fastify"
import { intersectionBy, sortBy } from "lodash"
import {
  chatCreate,
  chatGet,
  chatMemberCreate,
  chatMembersFind,
  clearUnreadCount,
  directMessageCreate,
  directMessagesFind,
  incrUnreadCount,
  userGet
} from "@task-2/persistence"

export const getChat = async (userId: number, chatId: number) => {
  const chat = await chatGet(chatId)

  if (!chat) {
    throw new errorCodes.FST_ERR_NOT_FOUND('Can\'t find chat by id')
  }

  const initiator = await userGet(chat.initiatorId)
  const recepient = await userGet(chat.recepientId)

  if (!initiator || !recepient) {
    throw new errorCodes.FST_ERR_NOT_FOUND('Can\'t find one of chat participants')
  }

  const [userMember] = await chatMembersFind({ chatId: chat.id, userId })

  return {
    id: chat.id,
    initiator,
    recepient,
    unreadCount: userMember.unreadCount,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt
  }
}

export const getChatsOfUser = async (userId: number) => {
  const members = await chatMembersFind({ userId })

  return Promise.all(
    members.map(({ chatId }) => getChat(userId, chatId))
  )
}

export const getChatForUser = async (initiatorId: number, recepientId: number) => {
  const initiatorMembers = await chatMembersFind({ userId: initiatorId })
  const recepientMembers = await chatMembersFind({ userId: recepientId })
  const bothMembers = intersectionBy(initiatorMembers, recepientMembers, 'chatId')

  if (bothMembers.length === 0) {
    return {
      id: -1,
      initiator: await userGet(initiatorId),
      recepient: await userGet(recepientId),
      unreadCount: 0,
      createdAt: new Date().getTime()
    }
  }

  const { chatId } = bothMembers[0]

  return getChat(initiatorId, chatId)
}

export const createChat = async (initiatorId: number, recepientId: number) => {
  const chatId = await chatCreate({
    initiatorId,
    recepientId,
    createdAt: new Date().getTime()
  })

  await Promise.all([
    chatMemberCreate({
      chatId,
      userId: initiatorId,
      type: 'initiator'
    }),
    chatMemberCreate({
      chatId,
      userId: recepientId,
      unreadCount: 1,
      type: 'recepient'
    })
  ])

  return { chatId }
}

export const sendMessage = async (chatId: number, authorId: number, recepientId: number, content: object) => {
  await directMessageCreate({
    chatId,
    authorId,
    content,
    createdAt: new Date().getTime()
  })

  const [recepientMember] = await chatMembersFind({ chatId, userId: recepientId })

  await incrUnreadCount(recepientMember.id)
}

export const getMessages = async (chatId: number) => {
  return sortBy(
    await directMessagesFind({ chatId }),
    (message) => Number(message.createdAt)
  ).map(message => ({
    ...message,
    content: typeof message.content === 'string'
      ? JSON.parse(message.content)
      : message.content
  }))
}

export const markRead = async (chatId: number, myId: number) => {
  const [member] = await chatMembersFind({ chatId, userId: myId })

  await clearUnreadCount(member.id)
}
