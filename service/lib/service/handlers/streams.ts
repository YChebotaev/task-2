import {
  postStreamRelationsFindPaginated,
  streamsFind,
  streamsFindFuzzyByTitle,
  userStreamSubscriptionsFind,
  streamCreate,
  userStreamSubscriptionCreate,
  userStreamSubscriptionDelete,
  type Pagination,
  type Stream as DbStream,
} from '@task-2/persistence'
import { errorCodes } from 'fastify'
import { getPostById } from './posts'

const getIsUserSubscribedToStream = async (userId: number, streamId: number) => {
  const [subscription] = await userStreamSubscriptionsFind({ userId, streamId: streamId })

  return Boolean(subscription)
}

const enrichStream = async (userId: number | undefined, { id, title, slug }: DbStream) => ({
  id,
  title,
  slug,
  ...(userId == null ? {} : {
    subscribed: await getIsUserSubscribedToStream(userId, id)
  })
})

export const getStreamBySlug = async (userId: number | undefined, slug: string) => {
  const [stream] = await streamsFind({ slug })

  if (!stream) {
    throw await errorCodes.FST_ERR_NOT_FOUND('Stream with given slug not found')
  }

  return enrichStream(userId, stream)
}

export const getPostsOfStream = async (userId: number | undefined, streamId: number, { limit, offset }: Pagination) => {
  const { items: relations, total } = await postStreamRelationsFindPaginated({ streamId }, { limit, offset })

  return {
    total,
    items: await Promise.all(
      relations.map(({ postId }) => getPostById(userId, postId))
    )
  }
}

export const findStreamsByTitleFuzzy = async (userId: number | undefined, fuzzyTitle: string) => {
  const dbStreams = await streamsFindFuzzyByTitle(fuzzyTitle)

  return Promise.all(dbStreams.map(s => enrichStream(userId, s)))
}

export const upsertStream = async (titleAndSlug: string) => {
  const [stream] = await streamsFind({ title: titleAndSlug })

  if (stream == null) {
    const streamId = await streamCreate({ title: titleAndSlug, slug: titleAndSlug })

    return streamId
  }

  return stream.id
}

export const subscribeToUser = async (userId: number, streamId: number, type: 'stream' | 'tag') => {
  const [subscription] = await userStreamSubscriptionsFind({ userId, streamId, type })

  if (subscription) {
    throw new Error('Cannot create double subscription')
  }

  await userStreamSubscriptionCreate({ userId, streamId, type })
}

export const unsubscribeFromUser = async (userId: number, streamId: number, type: 'stream' | 'tag') => {
  const [subscription] = await userStreamSubscriptionsFind({ userId, streamId, type })

  if (!subscription) {
    throw new errorCodes.FST_ERR_NOT_FOUND('Can\'t find subscription')
  }

  await userStreamSubscriptionDelete(subscription.id)
}
