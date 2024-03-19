import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('postStreamRelations', table => {
    table.increments('id')

    table.integer('postId')
    table.integer('streamId')
    table.enum('type', ['user', 'stream', 'tag'])

    table.foreign('postId')
      .references('id')
      .inTable('posts')
    table.foreign('streamId')
      .references('id')
      .inTable('streams')

    table.index('postId')
    table.index('streamId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('postStreamRelations')
