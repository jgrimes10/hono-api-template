import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/** The tasks table. */
export const tasks = sqliteTable('tasks', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    done: integer('done', { mode: 'boolean' }).notNull().default(false),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(cast((julianday('now') - 2440587.5) * 86400000 as integer))`),
});
