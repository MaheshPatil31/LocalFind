import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';

export async function authenticate(request, _response, next) {
  const [scheme, token] = (request.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    const error = new Error('Authentication is required.'); error.statusCode = 401; return next(error);
  }
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user) { const error = new Error('Authentication is required.'); error.statusCode = 401; throw error; }
    request.user = user;
    return next();
  } catch (error) {
    if (!error.statusCode) error.statusCode = 401;
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') error.message = 'Invalid or expired authentication token.';
    return next(error);
  }
}
