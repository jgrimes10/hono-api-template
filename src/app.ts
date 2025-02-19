import createApp from '@/lib/create-app.js';
import index from '@/routes/index.route';
import configureOpenApi from './lib/configure-open-api';

/** The app instance. */
const app = createApp();

/** The routes. */
const routes = [
    index,
];

// Configure OpenAPI.
configureOpenApi(app);

// Set up the routes.
routes.forEach((route) => {
    app.route('/', route);
});

export default app;
