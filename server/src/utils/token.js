import jwt from 'jsonwebtoken';
// require('dotenv').config();
import 'dotenv/config';

const REFRESH_TOKEN_SECRET = process.env.REFRESH_KEY;

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      roll: user.Roll,
      type: user.type
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '120m' }
  );
};



// Verify Refresh Token

export default generateRefreshToken;