import  { NextFunction, Request, Response } from 'express';
import express,{Router} from 'express';
import User, { IUser } from '../models/User';
import { verifyAccessToken,generateAccessToken,generateRefreshToken } from '../utils/tokens';
import expressjwt from "express-jwt";
import { verifyToken } from '../utils/tokens';

const router = Router();



// Delete user
router.delete('/:id', 

verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Refresh access token
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    // Verify the refresh token
    const decoded = verifyAccessToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate a new access token
    const accessToken = generateAccessToken(decoded.userId);

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
