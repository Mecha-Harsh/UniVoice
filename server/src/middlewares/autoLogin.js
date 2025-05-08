import jwt from 'jsonwebtoken';
import 'dotenv/config';
import express from 'express';

const router = express.Router();

const authenticateToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      req.user = {
        roll: null,
        type: "Guest"
      };
      return next();
    }

    const refreshKey = process.env.REFRESH_KEY;

    let decodedRefreshToken;
    try {
      decodedRefreshToken = jwt.verify(refreshToken, refreshKey);
    } catch (refreshError) {
      req.user = {
        roll: null,
        type: "Guest"
      };
      return next();
    }

    req.user = {
      roll: decodedRefreshToken.roll,
      type: decodedRefreshToken.type
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

router.get('/trigger-middleware', authenticateToken);

// ❌ REMOVE this line:
// module.exports = router;

// ✅ Export with ES modules:
export { router as autoLoginRouter };
export default authenticateToken;
