import { createCreateOperation, createDeleteOperation, createFindOperation, createGetAllOperation, createGetOperation } from '../lib'
import type { UserProfile, UserProfileCreateProps, UserProfileFindProps } from '../types'
import { knex } from '../knex'

export const userProfileCreate = createCreateOperation<UserProfileCreateProps>('userProfiles')

export const userProfileGet = createGetOperation<UserProfile>('userProfiles')

export const userProfileGetByUserId = async (userId: number) => {
  return knex
    .select('*')
    .from('userProfiles')
    .where('userId', userId)
    .first<UserProfile>()
}

export const userProfilesGetAll = createGetAllOperation<UserProfile>('userProfiles')

export const userProfilesFind = createFindOperation<UserProfile, UserProfileFindProps>('userProfiles')

export const userProfileDelete = createDeleteOperation('userProfiles')

export const userProfileUpdate = async (
  id: number,
  props: Partial<Omit<UserProfile, 'id' | 'userId'>>
) => {
  await knex('userProfiles')
    .update(props)
    .where('id', id)
}
