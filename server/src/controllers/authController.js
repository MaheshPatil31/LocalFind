import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { createToken, toSafeUser } from '../utils/auth.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validationError(message) { const error = new Error(message); error.statusCode = 400; return error; }

export async function register(request, response, next) {
  try {
    const { name, email, password, role = 'customer' } = request.body;
    if (!name?.trim() || !EMAIL_PATTERN.test(email || '') || !password) throw validationError('Name, a valid email, and password are required.');
    if (password.length < 8) throw validationError('Password must be at least 8 characters.');
    if (!['customer', 'businessOwner'].includes(role)) throw validationError('Registration role must be customer or businessOwner.');
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.exists({ email: normalizedEmail })) throw validationError('An account with that email already exists.');
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash, role });
    response.status(201).json({ token: createToken(user), user: toSafeUser(user) });
  } catch (error) {
    if (error.code === 11000) error = validationError('An account with that email already exists.');
    next(error);
  }
}

export async function login(request, response, next) {
  try {
    const { email, password } = request.body;
    if (!email || !password) throw validationError('Email and password are required.');
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      const error = new Error('Invalid email or password.'); error.statusCode = 401; throw error;
    }
    response.json({ token: createToken(user), user: toSafeUser(user) });
  } catch (error) { next(error); }
}

export function getCurrentUser(request, response) { response.json({ user: toSafeUser(request.user) }); }
