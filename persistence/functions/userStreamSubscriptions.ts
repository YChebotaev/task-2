import { createCreateOperation, createDeleteOperation, createFindOperation, createGetAllOperation, createGetOperation } from '../lib'
import type { UserStreamSubscription, UserStreamSubscriptionCreateProps, UserStreamSubscriptionFindProps } from '../types'

export const userStreamSubscriptionCreate = createCreateOperation<UserStreamSubscriptionCreateProps>('userStreamSubscriptions')

export const userStreamSubscriptionGet = createGetOperation<UserStreamSubscription>('userStreamSubscriptions')

export const userStreamSubscriptionsGetAll = createGetAllOperation<UserStreamSubscription>('userStreamSubscriptions')

export const userStreamSubscriptionsFind = createFindOperation<UserStreamSubscription, UserStreamSubscriptionFindProps>('userStreamSubscriptions')

export const userStreamSubscriptionDelete = createDeleteOperation('userStreamSubscriptions')
