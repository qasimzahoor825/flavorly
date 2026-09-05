import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

function signToken(user) {
  return jwt.sign({ sub: String(user.id), email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export const authController = {
  async register(req, res) {
    const { name, email, password } = req.body;

    if (User.findByEmail(email)) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = User.create({ name: String(name).trim(), email, passwordHash });
    const token = signToken(user);

    return res.status(201).json({ token, user: User.toPublic(user) });
  },

  async login(req, res) {
    const { email, password } = req.body;
    const user = User.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user);
    return res.json({ token, user: user.toPublic() });
  },

  me(req, res) {
    return res.json({ user: User.toPublic(req.user) });
  },
};