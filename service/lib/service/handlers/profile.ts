import { userProfileGetByUserId, userProfileUpdate, userProfilesFind } from '@task-2/persistence'
import { omit } from 'lodash'
import type { UserProfile } from '../../../types'

export const getProfileOfUser = async (userId: number) => {
  const profile = await userProfileGetByUserId(userId)

  return omit(profile, 'userId') as UserProfile
}

export const updateProfile = async (userId: number, props: Omit<UserProfile, 'id'>) => {
  const [profile] = await userProfilesFind({ userId })

  await userProfileUpdate(profile.id, props)
}
