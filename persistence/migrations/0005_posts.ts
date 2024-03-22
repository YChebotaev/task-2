import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('posts', table => {
    table.increments('id')

    table.integer('authorId')

    table.string('title').unique()
    table.json('content')
    table.bigInteger('createdAt')
    table.bigInteger('updatedAt').nullable()

    table.foreign('authorId')
      .references('id')
      .inTable('users')

    table.index('authorId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('posts')
