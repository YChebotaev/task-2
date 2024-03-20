import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('chats', table => {
    table.increments('id')

    table.integer('initiatorId')
    table.integer('recepientId')

    table.bigInteger('createdAt')
    table.bigInteger('updatedAt').nullable()

    table.foreign('initiatorId')
      .references('id')
      .inTable('users')
    table.foreign('recepientId')
      .references('id')
      .inTable('users')

    table.index('initiatorId')
    table.index('recepientId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('chats')
