import { type Knex } from "knex";
import { streamCreate } from '../functions'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("streams").del();

  // Inserts seed entries
  await streamCreate({
    title: 'Все подряд',
    slug: 'everything'
  })
};
