import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('directMessages', table => {
    table.increments('id')

    table.integer('chatId')
    table.integer('authorId')
    table.json('content')
    table.bigInteger('createdAt')
    table.bigInteger('updatedAt').nullable()

    table.foreign('chatId')
      .references('id')
      .inTable('chats')
    table.foreign('authorId')
      .references('id')
      .inTable('users')

    table.index('chatId')
    table.index('authorId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('directMessages')
