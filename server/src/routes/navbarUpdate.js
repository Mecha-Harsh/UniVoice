// In navbarUpdate.js
import express from 'express';
import authenticateToken from '../middlewares/autoLogin.js';
const router = express.Router();

// Handle the root path
router.get('/', authenticateToken, (req, res) => {
  const user = {
    type: req.user.type,
    roll: req.user.roll,
  }
  res.json(user);
});

// Keep the auto-login path as well if needed
router.get('/auto-login', authenticateToken, (req, res) => {
  const user = {
    type: req.user.type,
    roll: req.user.roll,
  }
  res.json(user);
});

export default router;