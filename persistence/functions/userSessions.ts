import { createCreateOperation, createDeleteOperation, createFindOperation, createGetAllOperation, createGetOperation } from '../lib'
import type { UserSession, UserSessionCreateProps, UserSessionFindProps } from '../types'
import { knex } from '../knex'

export const userSessionCreate = createCreateOperation<UserSessionCreateProps>('userSessions')

export const userSessionGet = createGetOperation<UserSession>('userSessions')

export const userSessionsGetAll = createGetAllOperation<UserSession>('userSessions')

export const userSessionsFind = createFindOperation<UserSession, UserSessionFindProps>('userSessions')

export const userSessionDelete = createDeleteOperation('userSessions')

export const userSessionUpdate = async (id: number, { accessToken }: Pick<UserSession, 'accessToken'>) => {
  await knex('userSessions')
    .update({ accessToken })
    .where('id', id)
}
