import { createCreateOperation, createDeleteOperation, createFindOperation, createGetAllOperation, createGetOperation } from '../lib'
import type { User, UserCreateProps, UserFindProps } from '../types'
import { knex } from '../knex'

const baseUserCreate = createCreateOperation<UserCreateProps>('users')

export const userCreate = async (props: Omit<UserCreateProps, 'avatarSrc' | 'coverSrc'>) => {
  return baseUserCreate({
    coverSrc: '/img/dummy-user-cover.png',
    avatarSrc: '/img/dummy-user-avatar.png',
    ...props,
  })
}

export const userGet = createGetOperation<User>('users')

export const usersGetAll = createGetAllOperation<User>('users')

export const userGetByUsername = async (username: string) => {
  return knex
    .select<User[]>('*')
    .from('users')
    .where(
      knex.raw('lower("username")'), '=', username.toLowerCase()
    )
    .first()
}

export const usersFind = createFindOperation<User, UserFindProps>('users')

export const userDelete = createDeleteOperation('users')

export const userUpdate = async (id: number, { coverSrc, avatarSrc }: {
  coverSrc?: string,
  avatarSrc?: string
}) => {
  await knex('users')
    .update({ coverSrc, avatarSrc })
    .where('id', id)
}
