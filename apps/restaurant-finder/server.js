import 'dotenv/config';

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  handleHealthRequest,
  handleRestaurantDetailsRequest,
  handleRestaurantSearchRequest,
  logMissingApiKeyWarning,
} from './lib/geoapifyApi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const port = Number(process.env.PORT || 3005);
const distPath = path.resolve(__dirname, 'dist');

logMissingApiKeyWarning();

app.use(express.json());
app.get('/api/health', handleHealthRequest);
app.get('/api/restaurants', handleRestaurantSearchRequest);
app.get('/api/restaurants/:restaurantId', handleRestaurantDetailsRequest);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distPath));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Restaurant Finder server listening on port ${port}`);
});
