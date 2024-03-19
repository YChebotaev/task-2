import { createCreateOperation, createDeleteOperation, createFindOperation, createGetAllOperation, createGetOperation } from '../lib'
import type { Stream, StreamCreateProps, StreamFindProps } from '../types'
import { knex } from '../knex'

export const streamCreate = createCreateOperation<StreamCreateProps>('streams')

export const streamGet = createGetOperation<Stream>('streams')

export const streamGetBySlug = async (slug: string) => {
  return knex
    .select<Stream[]>('*')
    .from('streams')
    .where('slug', slug)
    .first()
}

export const streamsGetAll = createGetAllOperation<Stream>('streams')

export const streamsFind = createFindOperation<Stream, StreamFindProps>('streams')

export const streamsFindFuzzyByTitle = async (fuzzyTitle: string) => {
  return knex
    .select<Stream[]>('*')
    .from('streams')
    .where('title', 'like', `%${fuzzyTitle}%`)
}

export const streamDelete = createDeleteOperation('streams')
