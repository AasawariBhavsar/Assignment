import { Request, Response } from 'express';
import express,{Router} from "express";
import bcrypt from 'bcrypt';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyAccessToken } from '../utils/tokens';

const router = Router();

// User signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.json({ message: 'Signup successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// User login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate access token and refresh token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
