import { createApp } from './app.js';
import { PORT } from './config/env.js';
import { DataStore } from './config/db.js';

DataStore.load();
const app = createApp();

app.listen(PORT, () => {
  console.log(`Flavorly API running at http://localhost:${PORT}`);
  console.log(`Health check:  GET http://localhost:${PORT}/api/health`);
});