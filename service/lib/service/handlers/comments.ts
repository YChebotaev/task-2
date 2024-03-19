import { commentCreate, commentsFind } from '@task-2/persistence'

export const createComment = async (authorId: number, { postId, parentId, content }: { postId: number, parentId?: number, content: object }) => {
  await commentCreate({
    postId,
    authorId,
    parentId,
    content,
    createdAt: new Date().getTime()
  })
}

export const getCommentsOfPost = async (_userId: number | undefined, postId: number) => {
  const comments = await commentsFind({ postId })

  return comments.map(comment => ({
    ...comment,
    content: typeof comment.content === 'string' ? JSON.parse(comment.content) : comment.content
  }))
}
