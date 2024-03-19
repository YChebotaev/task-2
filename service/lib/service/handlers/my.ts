import promiseAllProperties from 'promise-all-properties';
import { groupBy, mapValues } from 'lodash'
import { streamGet, userStreamSubscriptionsFind } from '@task-2/persistence'

export const getMySubscriptions = async (userId: number) => {
  const subscriptions = await userStreamSubscriptionsFind({ userId })

  return promiseAllProperties(
    mapValues(
      groupBy(subscriptions, 'type'),
      (items) => Promise.all(
        items.map(async ({ id, streamId }) => {
          const stream = await streamGet(streamId)

          return {
            id,
            title: stream?.title,
            slug: stream?.slug
          }
        })
      )
    )
  )
}
