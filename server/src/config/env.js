import 'dotenv/config';

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/localfind',
  mongoDbName: process.env.MONGODB_DB_NAME || 'localFind',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'localfind-development-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
