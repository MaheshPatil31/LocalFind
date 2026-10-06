import mongoose from 'mongoose';

export function getHealth(_request, response) {
  const databaseConnected = mongoose.connection.readyState === 1;

  response.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? 'ok' : 'degraded',
    service: 'localfind-api',
    database: databaseConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
}
