import { knex } from '../knex'

export const createGetOperation = <Entity>(tableName: string) => {
  return async (id: number) => {
    return knex
      .select('*')
      .from(tableName)
      .where('id', id)
      .first<Entity | undefined>()
  }
}
