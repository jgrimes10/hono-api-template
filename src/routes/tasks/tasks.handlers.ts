import db from '@/db';
import { tasks } from '@/db/schema';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from '@/lib/constants';
import type { AppRouteHandler } from '@/lib/types';
import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import type {
    CreateRoute,
    GetOneRoute,
    ListRoute,
    PatchRoute,
    RemoveRoute,
} from './tasks.routes';

/** Handler for the list route. */
export const list: AppRouteHandler<ListRoute> = async (c) => {
    const tasks = await db.query.tasks.findMany();
    return c.json(tasks);
};

/** Handler for the create route. */
export const create: AppRouteHandler<CreateRoute> = async (c) => {
    const task = c.req.valid('json');
    // Destructure the inserted task from the returned array (get the first element). You can technically
    // insert multiple tasks at once, and the return value will be an array of the inserted tasks.
    const [inserted] = await db.insert(tasks).values(task).returning();
    return c.json(inserted, HttpStatusCodes.CREATED);
};

/** Handler for the get one route. */
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
    const { id } = c.req.valid('param');
    // Try to find the task with the given ID.
    const task = await db.query.tasks.findFirst({
        where(fields, operators) {
            return operators.eq(fields.id, id);
        },
    });
    // If no task was found, return a 404.
    if (!task) {
        return c.json(
            { message: HttpStatusPhrases.NOT_FOUND },
            HttpStatusCodes.NOT_FOUND,
        );
    }
    return c.json(task, HttpStatusCodes.OK);
};

/** Handler for the patch route. */
export const patch: AppRouteHandler<PatchRoute> = async (c) => {
    const { id } = c.req.valid('param');
    const updates = c.req.valid('json');

    if (Object.keys(updates).length === 0) {
        return c.json(
            {
                success: false,
                error: {
                    issues: [
                        {
                            code: ZOD_ERROR_CODES.INVALID_UPDATES,
                            path: [],
                            message: ZOD_ERROR_MESSAGES.NO_UPDATES,
                        },
                    ],
                    name: 'ZodError',
                },
            },
            HttpStatusCodes.UNPROCESSABLE_ENTITY,
        );
    }
    // Try to update the task with the given ID.
    const [task] = await db
        .update(tasks)
        .set(updates)
        .where(eq(tasks.id, id))
        .returning();

    // If no task was found, return a 404.
    if (!task) {
        return c.json(
            { message: HttpStatusPhrases.NOT_FOUND },
            HttpStatusCodes.NOT_FOUND,
        );
    }
    return c.json(task, HttpStatusCodes.OK);
};

/** Handler for the remove route. */
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
    const { id } = c.req.valid('param');
    // Try to update the task with the given ID.
    const result = await db.delete(tasks).where(eq(tasks.id, id));

    // If no task was found, return a 404.
    if (result.rowsAffected === 0) {
        return c.json(
            { message: HttpStatusPhrases.NOT_FOUND },
            HttpStatusCodes.NOT_FOUND,
        );
    }
    return c.body(null, HttpStatusCodes.NO_CONTENT);
};
