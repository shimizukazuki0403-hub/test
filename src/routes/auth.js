import { Router } from 'express';
import bcrypt from 'bcrypt';
import { findUserByUserId } from '../models/users.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { userId, password } = req.body ?? {};
  if (!userId || !password) return res.status(400).json({ error: 'userId and password required' });

  const user = findUserByUserId(userId);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  req.session.user = { id: user.id, userId: user.user_id };
  res.json({ ok: true, user: req.session.user });
});

router.post('/logout', (req, res) => {
  req.session.destroy?.(() => {});
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  res.json({ user: req.session?.user ?? null });
});

export default router;
