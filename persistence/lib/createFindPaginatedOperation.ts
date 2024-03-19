import { knex } from '../knex'
import { Paginated, Pagination } from '../types'

export const createFindPaginatedOperation = <Entity, FindProps extends {}>(tableName: string) => {
  return async (props: FindProps, { limit, offset }: Pagination) => {
    const items = await Object
      .entries(props)
      .reduce(
        (k, [key, value]: [string, any]) => k.modify(k => k.where(key, value)),
        knex
          .select<Entity[]>('*')
          .from(tableName)
      )
      .limit(limit)
      .offset(offset)

    const total = (await (Object
      .entries(props)
      .reduce(
        (k, [key, value]: [string, any]) => k.modify(k => k.where(key, value)),
        knex
          .from(tableName)
      )
      .count<{ [key: string]: number }>())
      .first() ?? {})['count(*)'] ?? 0

    return {
      total: total as number,
      items: items as Entity[]
    } as Paginated<Entity>
  }
}
