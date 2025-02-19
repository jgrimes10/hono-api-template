import type { AppBindings, AppOpenApi } from '@/lib/types';
import { pinoLogger } from '@/middlewares/pino-logger.js';
import { OpenAPIHono } from '@hono/zod-openapi';
import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares';
import { defaultHook } from 'stoker/openapi';

/**
 * Create a router.
 * @returns {OpenAPIHono<AppBindings>} The router.
 */
export function createRouter(): OpenAPIHono<AppBindings> {
  /** Create an OpenAPIHono instance. */
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

/**
 * Create an app with the default middlewares.
 * @returns {OpenAPIHono<AppBindings>} The app.
 */
export default function createApp(): OpenAPIHono<AppBindings> {
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

/**
 * Create a test app with the given router.
 * @param {AppOpenApi} router The router to use.
 * @returns {OpenAPIHono<AppBindings>} The test app.
 */
export function createTestApp(router: AppOpenApi): OpenAPIHono<AppBindings> {
  const testApp = createApp();
  testApp.route('/', router);

  return testApp;
}
