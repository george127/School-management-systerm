// routes/paymentInfoRoutes.ts - Alternative version with type assertion
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to verify JWT token
const verifyToken = (token: string): { userId?: number; email?: string } | null => {
  try {
    // Implement your JWT verification logic here
    return null;
  } catch (error) {
    return null;
  } 
};

// Route 1: Get payment details for a specific email
router.get('/fees/:email', async (req: Request, res: Response) => {
  try {
    const email = req.params.email as string; // Type assertion
    
    if (!email) {
      return res.status(400).json({ 
        error: 'Email parameter is required',
        userForm: null 
      });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        studentId: true,
      }
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        userForm: null 
      });
    }

    // Get all payments for this user
    const payments = await prisma.payment.findMany({
      where: {
        email: email,
        status: 'success',
      },
      orderBy: {
        paidAt: 'asc'
      }
    });

    // Format payment records
    const paymentRecords = payments.map(payment => ({
      semester: payment.semester,
      installment: payment.installment,
      amountPaid: payment.amountPaid || 0,
      status: payment.status || 'pending',
      transactionId: payment.transactionId || '',
      date: payment.paidAt ? payment.paidAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    }));

    const responseData = {
      userForm: {
        paystack: {
          records: paymentRecords
        }
      },
      user: {
        name: user.name,
        email: user.email,
        studentId: user.studentId
      }
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Route 2: Get payment progress for a specific email
router.get('/payment-progress/:email', async (req: Request, res: Response) => {
  try {
    const email = req.params.email as string; // Type assertion
    
    if (!email) {
      return res.status(400).json({ 
        error: 'Email parameter is required'
      });
    }

    // Get all successful payments for this email
    const payments = await prisma.payment.findMany({
      where: {
        email: email,
        status: 'success',
      },
      select: {
        semester: true,
        amountPaid: true,
        installment: true,
      }
    });

    // Define fee structure per semester
    const FEE_STRUCTURE = {
      "First Semester": {
        "First Installment": 2000,
        "Second Installment": 2000,
        "Third Installment": 1920,
        total: 5920
      },
      "Second Semester": {
        "First Installment": 2000,
        "Second Installment": 2000,
        "Third Installment": 1920,
        total: 5920
      },
      "Third Semester": {
        "First Installment": 2000,
        "Second Installment": 2000,
        "Third Installment": 1920,
        total: 5920
      }
    };

    // Calculate progress for each semester
    const paymentProgress = {
      "First Semester": 0,
      "Second Semester": 0,
      "Third Semester": 0
    };

    // Group payments by semester
    const paymentsBySemester: Record<string, number> = {
      "First Semester": 0,
      "Second Semester": 0,
      "Third Semester": 0
    };

    payments.forEach(payment => {
      if (payment.amountPaid) {
        paymentsBySemester[payment.semester] = (paymentsBySemester[payment.semester] || 0) + payment.amountPaid;
      }
    });

    // Calculate percentage for each semester
    Object.keys(paymentProgress).forEach(semester => {
      const totalPaid = paymentsBySemester[semester] || 0;
      const totalExpected = FEE_STRUCTURE[semester as keyof typeof FEE_STRUCTURE].total;
      const percentage = totalExpected > 0 ? (totalPaid / totalExpected) * 100 : 0;
      paymentProgress[semester as keyof typeof paymentProgress] = Math.round(percentage * 100) / 100;
    });

    res.status(200).json(paymentProgress);
  } catch (error) {
    console.error('Error fetching payment progress:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;