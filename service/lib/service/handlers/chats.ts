import { errorCodes } from "fastify"
import { sortBy } from "lodash"
import {
  chatCreate,
  chatGet,
  chatMemberCreate,
  chatMembersFind,
  directMessageCreate,
  directMessagesFind,
  userGet
} from "@task-2/persistence"

export const getChatsOfUser = async (userId: number) => {
  const members = (
    await chatMembersFind({ userId })
  ).filter(({ userId: u }) => u !== userId)

  return Promise.all(
    members.map(({ userId: u }) => getChatForUser(userId, u))
  )
}

export const getChatForUser = async (initiatorId: number, recepientId: number) => {
  const initiator = await userGet(initiatorId)
  const recepient = await userGet(recepientId)

  if (!initiator || !recepient) {
    throw new errorCodes.FST_ERR_NOT_FOUND('Can\'t found one of chat participants')
  }

  const initiatorMembers = await chatMembersFind({ userId: initiatorId })
  const recepientMembers = await chatMembersFind({ userId: recepientId })

  const chatsBothAreMembers = initiatorMembers.filter(initiatorMember =>
    recepientMembers.some(recepientMember => initiatorMember.chatId === recepientMember.chatId)
  );

  if (chatsBothAreMembers.length === 0) {
    return {
      id: -1,
      initiator,
      recepient,
      createdAt: new Date().getTime()
    }
  }

  const chatId = chatsBothAreMembers[0].chatId
  const chat = await chatGet(chatId)

  if (!chat) {
    throw new errorCodes.FST_ERR_NOT_FOUND("Cant\'t find chat by id")
  }

  return {
    id: chat.id,
    initiator,
    recepient,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt
  }
}

const createChat = async (initiatorId: number, recepientId: number) => {
  const chatId = await chatCreate({
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
      type: 'recepient'
    })
  ])

  return {
    chatId
  }
}

export const sendMessage = async (initiatorId: number, recepientId: number, content: object) => {
  const chat = await getChatForUser(initiatorId, recepientId)

  if (chat.id === -1) {
    const { chatId } = await createChat(initiatorId, recepientId)

    await directMessageCreate({
      chatId,
      authorId: initiatorId,
      content,
      createdAt: new Date().getTime(),
    })
  } else {
    await directMessageCreate({
      chatId: chat.id,
      authorId: initiatorId,
      content,
      createdAt: new Date().getTime(),
    })
  }
}

export const getMessages = async (initiatorId: number, recepientId: number) => {
  const chat = await getChatForUser(initiatorId, recepientId)

  if (chat.id === -1) return []

  return sortBy(
    await directMessagesFind({ chatId: chat.id }),
    'createdAt'
  ).map(message => ({
    ...message,
    content: typeof message.content === 'string'
      ? JSON.parse(message.content)
      : message.content
  }))
}
