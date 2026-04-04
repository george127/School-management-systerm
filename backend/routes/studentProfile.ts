import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/student/profile/:email', async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const student = await prisma.student.findUnique({
      where: { email },
      include: {
        user: {
          select: {
            studentId: true,
            name: true
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
      email: student.email,
      programName: student.programName,
      phone: student.phone,
      nationality: student.nationality,
      fullName: student.fullName,
      profileImage: student.profileImage
    });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/student/student-id/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        studentId: true,
        name: true,
        email: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      studentId: user.studentId || null,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Error fetching student ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;