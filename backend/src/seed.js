import { DataStore } from './config/db.js';
import { seedIfEmpty } from './seed-data.js';

DataStore.load();
if (seedIfEmpty()) {
  console.log(`Seeded ${DataStore.db.recipes.length} recipes into data/db.json`);
} else {
  console.log('Database already has data — nothing to seed.');
}