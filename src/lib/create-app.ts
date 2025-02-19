import type { AppBindings } from '@/lib/types';
import { pinoLogger } from '@/middlewares/pino-logger.js';
import { OpenAPIHono } from '@hono/zod-openapi';
import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares';
import { defaultHook } from 'stoker/openapi';

/** Create an OpenAPIHono instance. */
export function createRouter() {
    /** Create an OpenAPIHono instance. */
    return new OpenAPIHono<AppBindings>({
        strict: false,
        defaultHook,
    });
}

/** Create an OpenAPIHono instance and configure it. */
export default function createApp() {
    /** Create an OpenAPIHono instance. */
    const app = createRouter();

    /**
     * Add middlewares.
     */

    // Add a favicon middleware that serves an emoji favicon.
    app.use(serveEmojiFavicon('📝'));
    // Add a logger middleware that logs requests.
    app.use(pinoLogger());

    // Add a not found handler.
    app.notFound(notFound);
    // Add an error handler.
    app.onError(onError);

    return app;
}
