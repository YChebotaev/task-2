import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('comments', table => {
    table.increments('id')

    table.integer('postId')
    table.integer('authorId')
    table.integer('parentId').nullable()

    table.json('content')
    table.bigInteger('createdAt')
    table.bigInteger('updatedAt').nullable()

    table.foreign('postId')
      .references('id')
      .inTable('posts')
    table.foreign('authorId')
      .references('id')
      .inTable('users')
    table.foreign('parentId')
      .references('id')
      .inTable('comments')

    table.index('postId')
    table.index('authorId')
    table.index('parentId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('comments')
