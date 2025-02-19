import createApp from '@/lib/create-app.js';
import index from '@/routes/index.route';
import tasks from '@/routes/tasks/tasks.index';
import configureOpenApi from './lib/configure-open-api';

/** The app instance. */
const app = createApp();

/** The routes. */
const routes = [
    index,
    tasks,
] as const;

// Configure OpenAPI.
configureOpenApi(app);

// Set up the routes.
routes.forEach((route) => {
    app.route('/', route);
});

export type AppType = typeof routes[number];

export default app;
