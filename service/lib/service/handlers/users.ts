import { errorCodes } from 'fastify'
import {
  streamGetBySlug,
  userGet,
  userStreamSubscriptionsFind,
  userStreamSubscriptionCreate,
  userStreamSubscriptionDelete,
  uploadGet,
  userUpdate,
  userGetByUsername,
  type User as DbUser,
} from '@task-2/persistence'

const augmentUser = async (myId: number | undefined, user: DbUser) => {
  return {
    id: user.id,
    username: user.username,
    avatarSrc: user.avatarSrc,
    coverSrc: user.coverSrc,
    ...((myId != null && myId !== user.id) ? {
      subscribed: await userGetIsSubscribedToUser(myId, user.id)
    } : {})
  }
}

export const userGetIsSubscribedToUser = async (myId: number, userId: number) => {
  const user = await userGet(userId)

  if (!user) {
    throw new errorCodes.FST_ERR_NOT_FOUND('Can\'t find my profile')
  }

  const stream = await streamGetBySlug(user.username)

  if (!stream) {
    throw new errorCodes.FST_ERR_NOT_FOUND('Can\'t find my stream')
  }

  const [subscription] = await userStreamSubscriptionsFind({
    userId: myId,
    streamId: stream.id
  })

  return Boolean(subscription)
}

export const getUserById = async (myId: number | undefined, userId: number) => {
  const user = await userGet(userId)

  if (!user) {
    throw new errorCodes.FST_ERR_NOT_FOUND('User not found by id')
  }

  return augmentUser(myId, user)
}

export const getUserByUsername = async (myId: number | undefined, username: string) => {
  const user = await userGetByUsername(username)

  if (!user) {
    throw new errorCodes.FST_ERR_NOT_FOUND('Can\'t find user by username')
  }

  return augmentUser(myId, user)
}

export const subscribeToUser = async (myId: number, userId: number) => {
  const user = await userGet(userId)

  if (!user) {
    throw new errorCodes.FST_ERR_NOT_FOUND('Can\'t find user by id')
  }

  const userStream = await streamGetBySlug(user.username)

  if (!userStream) {
    throw new errorCodes.FST_ERR_NOT_FOUND('Can\'t find user stream by id')
  }

  const [subscription] = await userStreamSubscriptionsFind({
    userId: myId,
    streamId: userStream.id,
    type: 'user'
  })

  if (subscription) {
    throw new Error('Cannot make duplicate subscription')
  }

  await userStreamSubscriptionCreate({
    userId: myId,
    streamId: userStream.id,
    type: 'user'
  })
}

export const unsubscribeFromUser = async (meId: number, userId: number) => {
  const user = await userGet(userId)

  if (!user) {
    throw new errorCodes.FST_ERR_NOT_FOUND('Can\'t find user by id')
  }

  const userStream = await streamGetBySlug(user.username)

  if (!userStream) {
    throw new errorCodes.FST_ERR_NOT_FOUND('Can\'t find user stream by id')
  }

  const [subscription] = await userStreamSubscriptionsFind({
    userId: user.id,
    streamId: userStream.id
  })

  if (!subscription) {
    throw new errorCodes.FST_ERR_NOT_FOUND('Can\'t find subscription')
  }

  await userStreamSubscriptionDelete(subscription.id)
}

export const setAvatar = async (userId: number, uploadId: number) => {
  const upload = await uploadGet(uploadId)

  if (!upload) {
    throw new errorCodes.FST_ERR_NOT_FOUND('Upload not found by id')
  }

  await userUpdate(userId, { avatarSrc: `/uploads/${upload.filename}` })
}

export const setCover = async (userId: number, uploadId: number) => {
  const upload = await uploadGet(uploadId)

  if (!upload) {
    throw new errorCodes.FST_ERR_NOT_FOUND('Upload not found by id')
  }

  await userUpdate(userId, { coverSrc: `/uploads/${upload.filename}` })
}
