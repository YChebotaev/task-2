import { createCreateOperation, createDeleteOperation, createFindOperation, createFindPaginatedOperation, createGetAllOperation, createGetOperation } from '../lib'
import type { PostStreamRelation, PostStreamRelationCreateProps, PostStreamRelationFindProps } from '../types'

export const postStreamRelationCreate = createCreateOperation<PostStreamRelationCreateProps>('postStreamRelations')

export const postStreamRelationGet = createGetOperation<PostStreamRelation>('postStreamRelations')

export const postStreamRelationsGetAll = createGetAllOperation<PostStreamRelation>('postStreamRelations')

export const postStreamRelationsFindPaginated = createFindPaginatedOperation<PostStreamRelation, PostStreamRelationFindProps>('postStreamRelations')

export const postStreamRelationsFind = createFindOperation<PostStreamRelation, PostStreamRelationFindProps>('postStreamRelations')

export const postStreamRelationDelete = createDeleteOperation('postStreamRelations')
