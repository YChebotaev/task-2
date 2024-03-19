import { knex } from '../knex'

export const createFindOperation = <Entity, FindProps extends {}>(tableName: string) => {
  return async (props: FindProps) => {
    return Object
      .entries(props)
      .reduce(
        (k, [key, value]: [string, any]) => k.modify(k => k.where(key, value)),
        knex
          .select<Entity[]>('*')
          .from(tableName)
      )
  }
}
