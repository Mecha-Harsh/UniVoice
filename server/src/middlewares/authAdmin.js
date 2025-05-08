import jwt from 'jsonwebtoken';
//import { generateAccessToken } from '../utils/token.js';
import 'dotenv/config';

const authenticateToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Unauthorized: No refresh token provided' });
    }

    const refreshKey = process.env.REFRESH_KEY;

    let decodedRefreshToken;
    try {
      decodedRefreshToken = jwt.verify(refreshToken, refreshKey);
    } catch (refreshError) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    if(decodedRefreshToken.type!=="Admin"){
      res.status(404).json({error:"Unauthorized access"});
    }

    req.user = {
      roll: decodedRefreshToken.roll,
      type: decodedRefreshToken.type
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default authenticateToken;