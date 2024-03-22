import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('userStreamSubscriptions', table => {
    table.increments('id')

    table.integer('userId')
    table.integer('streamId')
    table.enum('type', ['user', 'stream', 'tag'])

    table.foreign('userId')
      .references('id')
      .inTable('users')
    table.foreign('streamId')
      .references('id')
      .inTable('streams')

    table.index('userId')
    table.index('streamId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('userStreamSubscriptions')
