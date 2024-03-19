import { createCreateOperation, createDeleteOperation, createFindOperation, createGetAllOperation, createGetOperation } from '../lib'
import type { DirectMessage, DirectMessageCreateProps, DirectMessageFindProps } from '../types'

export const directMessageCreate = createCreateOperation<DirectMessageCreateProps>('directMessages')

export const directMessageGet = createGetOperation<DirectMessage>('directMessages')

export const directMessagesGetAll = createGetAllOperation<DirectMessage>('directMessages')

export const directMessagesFind = createFindOperation<DirectMessage, DirectMessageFindProps>('directMessages')

export const directMessageDelete = createDeleteOperation('directMessages')
