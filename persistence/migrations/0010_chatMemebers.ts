import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('chatMembers', table => {
    table.increments('id')

    table.integer('chatId')
    table.integer('userId')
    table.enum('type', ['initiator', 'recepient'])

    table.bigInteger('createdAt')
    table.bigInteger('updatedAt').nullable()

    table.foreign('chatId')
      .references('id')
      .inTable('chats')
    table.foreign('userId')
      .references('id')
      .inTable('users')

    table.index('chatId')
    table.index('userId')
    table.index('type')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('chatMembers')
