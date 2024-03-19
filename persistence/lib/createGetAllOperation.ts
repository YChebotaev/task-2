import { knex } from '../knex'

export const createGetAllOperation = <Entity>(tableName: string) => {
  return async () => {
    return knex
      .select<Entity[]>('*')
      .from(tableName)
  }
}
