import { createRouter } from '@/lib/create-app';
import * as handlers from './tasks.handlers';
import * as routes from './tasks.routes';

/** Tasks route. */
const router = createRouter()
    .openapi(routes.list, handlers.list);

export default router;
