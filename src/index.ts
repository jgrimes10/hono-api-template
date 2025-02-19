import app from '@/app';
import env from '@/env';
import { serve } from '@hono/node-server';

serve(
    {
        fetch: app.fetch,
        port: env.PORT,
    },
    (info) => {
        console.log(`Server is running on http://${info.address}:${info.port}`);
    },
);
