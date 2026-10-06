import app from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

await connectDatabase();

app.listen(env.port, () => {
  console.log(`LocalFind API listening on port ${env.port}`);
});
