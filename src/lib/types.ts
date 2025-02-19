import type { OpenAPIHono } from '@hono/zod-openapi';
import type { PinoLogger } from 'hono-pino';

/** The bindings for the app. */
export interface AppBindings {
    Variables: {
        logger: PinoLogger;
    };
};

/** The OpenAPI type for the app. */
export type AppOpenApi = OpenAPIHono<AppBindings>;
