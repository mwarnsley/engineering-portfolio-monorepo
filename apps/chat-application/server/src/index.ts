import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { createSocketServer } from './socket/createSocketServer.js';
import { logServerStart } from './utils/logger.js';

const port = Number(process.env.PORT ?? 3010);
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_request, response) => {
  response.json({
    status: 'ok',
  });
});

const server = http.createServer(app);
createSocketServer(server);

server.listen(port, () => {
  logServerStart(port);
});
