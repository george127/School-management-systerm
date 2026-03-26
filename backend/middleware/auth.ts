import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // For testing purposes, we'll use a default user ID from header or query
    // In production, you should verify JWT token here
    
    // Option 1: Get user ID from header (for testing)
    const userId = req.headers['x-user-id'] || req.query.userId;
    
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId as string) },
        select: { id: true, email: true, role: true }
      });
      
      if (user) {
        req.user = user;
        return next();
      }
    }
    
    // Option 2: Use a default test user (only for development)
    // WARNING: Remove this in production!
    if (process.env.NODE_ENV === 'development') {
      const testUser = await prisma.user.findUnique({
        where: { id: 1 },
        select: { id: true, email: true, role: true }
      });
      
      if (testUser) {
        req.user = testUser;
        console.log('Using test user:', testUser.email);
        return next();
      }
    }
    
    return res.status(401).json({ 
      message: 'Authentication required' 
    });
    
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      message: 'Authentication failed' 
    });
  }
};