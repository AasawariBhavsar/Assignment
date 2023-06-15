import jwt,{JwtPayload} from 'jsonwebtoken';
import { Request,Response,NextFunction } from 'express';
import expressjwt from "express-jwt";

const ACCESS_TOKEN_SECRET = 'your-access-token-secret';
const REFRESH_TOKEN_SECRET = 'your-refresh-token-secret';

export interface CustomRequest extends Request {
  token: string | JwtPayload;
 }

// Generate access token
export const generateAccessToken = (userId: string): string => {
  const payload = { userId };
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '120s' });
};

// Generate refresh token
export const generateRefreshToken = (userId: string): string => {
  const payload = { userId };
  return jwt.sign(payload, REFRESH_TOKEN_SECRET);
};

// Verify access token by parameter
export const verifyAccessToken = (token: string): any => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
    
  } catch(err) {
    return err 
  }
  
};

// Verify access token from header
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
 
    if (!token) {
      throw new Error();
    }
 
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    (req as CustomRequest).token = decoded;
 
    next();
  } catch (err) {
    res.status(401).send('Please authenticate');
  }
};