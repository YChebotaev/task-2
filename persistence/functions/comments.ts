import { createCreateOperation, createDeleteOperation, createFindOperation, createGetAllOperation, createGetOperation } from '../lib'
import type { Comment, CommentCreateProps, CommentFindProps } from '../types'

export const commentCreate = createCreateOperation<CommentCreateProps>('comments')

export const commentGet = createGetOperation<Comment>('comments')

export const commentsGetAll = createGetAllOperation<Comment>('comments')

export const commentsFind = createFindOperation<Comment, CommentFindProps>('comments')

export const commentDelete = createDeleteOperation('comments')
