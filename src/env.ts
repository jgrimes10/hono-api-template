import type { ZodError } from 'zod';
import path from 'node:path';
import { config as dotenv } from 'dotenv';
import { expand } from 'dotenv-expand';
import { z } from 'zod';

// Set up environment variables.
expand(dotenv({
    path: path.resolve(
        process.cwd(),
        // eslint-disable-next-line node/no-process-env
        process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    ),
}));

/** The schema for the environment variables. */
const EnvSchema = z.object({
    DATABASE_URL: z.string().url(),
    DATABASE_AUTH_TOKEN: z.string().optional(),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),
    NODE_ENV: z.string().default('development'),
    PORT: z.coerce.number().default(9999),
}).superRefine((input, ctx) => {
    if (input.NODE_ENV === 'production' && !input.DATABASE_AUTH_TOKEN) {
        ctx.addIssue({
            code: z.ZodIssueCode.invalid_type,
            expected: 'string',
            received: 'undefined',
            path: ['DATABASE_AUTH_TOKEN'],
            message: 'Must be set when NODE_ENV is \'production\'',
        });
    }
});

/** The type of the environment variables. */
export type env = z.infer<typeof EnvSchema>;

/** The environment variables accessible to the application. */
// eslint-disable-next-line import/no-mutable-exports, ts/no-redeclare
let env: env;

try {
    // This is the only place where we should access process.env, everwhere else
    // should use the env object.
    // eslint-disable-next-line node/no-process-env
    env = EnvSchema.parse(process.env);
}
catch (e) {
    const error = e as ZodError;
    console.error('❌ Invalid env:');
    console.error(error.flatten().fieldErrors);
    process.exit(1);
}

export default env;
