import packageJSON from '@/../package.json';
import type { AppOpenApi } from '@/lib/types';
import { apiReference } from '@scalar/hono-api-reference';

/** Configure the OpenAPI document. */
export default function configureOpenApi(app: AppOpenApi) {
    app.doc('/doc', {
        openapi: '3.0.0',
        info: {
            version: packageJSON.version,
            title: 'Tasks API',
        },
    });

    app.get(
        '/reference',
        apiReference({
            theme: 'kepler',
            layout: 'classic',
            defaultHttpClient: {
                targetKey: 'js',
                clientKey: 'fetch',
            },
            spec: {
                url: '/doc',
            },
        }),
    );
}
