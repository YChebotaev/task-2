import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('chats', table => {
    table.increments('id')

    table.bigInteger('createdAt')
    table.bigInteger('updatedAt').nullable()
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('chats')
