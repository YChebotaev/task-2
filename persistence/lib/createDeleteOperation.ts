import { knex } from '../knex'

export const createDeleteOperation = (tableName: string) => {
  return async (id: number) => {
    await knex
      .delete()
      .from(tableName)
      .where('id', id)
  }
}
