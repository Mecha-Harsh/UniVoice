import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
  try {
    // Clear both refresh and access tokens
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/' // Important: specify the path
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error during logout' });
  }
});

export default router;