import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { PinoLogger } from 'hono-pino';

/** The bindings for the app. */
export interface AppBindings {
    Variables: {
        logger: PinoLogger;
    };
};

/** The OpenAPI type for the app. */
export type AppOpenApi = OpenAPIHono<AppBindings>;

/** The route handler type for the app. */
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;
