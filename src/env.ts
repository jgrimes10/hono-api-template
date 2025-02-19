import type { ZodError } from 'zod';
import { config as dotenv } from 'dotenv';
import { expand } from 'dotenv-expand';
import { z } from 'zod';

// Set up environment variables.
expand(dotenv());

/** The schema for the environment variables. */
const EnvSchema = z.object({
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
    NODE_ENV: z.string().default('development'),
    PORT: z.coerce.number().default(9999),
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
