import env from '@/env';
import { pinoLogger as logger } from 'hono-pino';
import pretty from 'pino-pretty';

/**
 * Create a Pino logger middleware.
 */
export function pinoLogger() {
    /** If the environment is production, do not use pretty print. */
    const prettyStream = env.NODE_ENV === 'production' ? undefined : pretty();

    return logger({
        pino: {
            level: env.LOG_LEVEL || 'info',
            transport: prettyStream
                ? {
                      target: 'pino-pretty',
                  }
                : undefined,
        },
        http: {
            reqId: () => crypto.randomUUID(),
        },
    });
}
