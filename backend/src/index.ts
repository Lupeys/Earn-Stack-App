import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

// Route imports (to be implemented)
// import auth from './routes/auth';
// import tasks from './routes/tasks';
// import earnings from './routes/earnings';
// import payouts from './routes/payouts';
// import admin from './routes/admin';

const app = new Hono();

app.use('*', cors({ origin: ['https://earnstack.ca', 'http://localhost:3000'] }));
app.use('*', logger());

app.get('/api/health', (c) => c.json({ status: 'ok', app: 'EarnStack', version: '0.1.0' }));

// app.route('/api/auth', auth);
// app.route('/api/tasks', tasks);
// app.route('/api/earnings', earnings);
// app.route('/api/payouts', payouts);
// app.route('/api/admin', admin);

export default {
  port: 3001,
  fetch: app.fetch,
};
