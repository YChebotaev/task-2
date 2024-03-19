import { knex } from '../knex'

export const createCreateOperation = <CreateProps extends {}>(tableName: string) => {
  return async (props: CreateProps) => {
    const [{ id }] = await knex
      .insert(props)
      .into(tableName)
      .returning<{ id: number }[]>('id')

    return id
  }
}
