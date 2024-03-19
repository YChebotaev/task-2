import { createCreateOperation, createDeleteOperation, createFindOperation, createGetAllOperation, createGetOperation } from '../lib'
import type { Post, PostCreateProps, PostFindProps } from '../types'
import { knex } from '../knex'

export const postCreate = createCreateOperation<PostCreateProps>('posts')

export const postGet = createGetOperation<Post>('posts')

export const postsGetAll = createGetAllOperation<Post>('posts')

export const postsFind = createFindOperation<Post, PostFindProps>('posts')

export const postDelete = createDeleteOperation('posts')

export const postCommentsCount = async (id: number) => {
  const result = await knex('comments')
    .where('postId', id)
    .count()
    .first()

  return result ? Reflect.get(result, 'count(*)') as number : 0
}
