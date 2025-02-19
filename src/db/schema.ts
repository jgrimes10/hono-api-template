import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

/** The tasks table. */
export const tasks = sqliteTable('tasks', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    done: integer('done', { mode: 'boolean' }).notNull().default(false),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).$onUpdate(() => new Date()),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

/** The schema for selecting tasks. */
export const selectTasksSchema = createSelectSchema(tasks);

/** The schema for inserting tasks. */
export const insertTasksSchema = createInsertSchema(
    tasks,
    {
        name: schema => schema.min(1).max(500),
    },
).required({
    done: true,
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

/** The schema for updating tasks. */
export const patchTasksSchema = insertTasksSchema.partial();
