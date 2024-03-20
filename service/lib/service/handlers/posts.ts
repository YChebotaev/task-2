import {
  postCommentsCount,
  postCreate,
  postGet,
  postStreamRelationCreate,
  postStreamRelationsFind,
  streamGet,
  streamGetBySlug,
  userGet
} from '@task-2/persistence'
import { errorCodes } from 'fastify'
import { upsertStream } from './streams'

const getPostTags = async (postId: number) => {
  const relations = await postStreamRelationsFind({ postId, type: 'tag' })

  return Promise.all(
    relations.map(async ({ id, streamId }) => {
      const stream = await streamGet(streamId)

      return {
        id,
        title: stream?.title,
        slug: stream?.slug
      }
    })
  )
}

export const getPostById = async (_userId: number | undefined, postId: number) => {
  const post = await postGet(postId)

  if (!post) {
    throw new errorCodes.FST_ERR_NOT_FOUND('Post not found with given id')
  }

  return {
    ...post,
    tags: await getPostTags(post.id),
    content: typeof post.content === 'string' ? JSON.parse(post.content) : post.content,
    commentsCount: await postCommentsCount(post.id)
  }
}

export const createPost = async (authorId: number, { title, content, tags }: { title: string, content: object, tags: string[] }) => {
  const postId = await postCreate({
    title,
    authorId,
    content,
    createdAt: new Date().getTime(),
  })

  do {
    const authorUser = await userGet(authorId)

    if (!authorUser) break

    const stream = await streamGetBySlug(authorUser.username)

    if (!stream) break

    await postStreamRelationCreate({ postId, streamId: stream.id, type: 'user' })
  } while (false)

  for (const tag of tags) {
    const streamId = await upsertStream(tag)

    await postStreamRelationCreate({ postId, streamId, type: 'tag' })
  }

  do {
    const everythingStream = await streamGetBySlug('everything')

    if (!everythingStream) break

    await postStreamRelationCreate({
      postId,
      streamId: everythingStream.id,
      type: 'stream'
    })
  } while (false)
}
