// routes/feesPaymentRoutes.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Helper to ensure email is a string
const getEmailString = (email: string | string[] | undefined): string | null => {
  if (!email) return null;
  return Array.isArray(email) ? email[0] : email;
};

// Helper to ensure id is a number
const getNumberId = (id: string | string[] | undefined): number | null => {
  if (!id) return null;
  const idStr = Array.isArray(id) ? id[0] : id;
  const numId = parseInt(idStr);
  return isNaN(numId) ? null : numId;
};

// ==================== PAYMENT ENDPOINTS ====================

// POST: Save form data when user initiates payment
router.post('/SaveFormData', async (req: Request, res: Response) => {
  const { email, semester, installment } = req.body;

  try {
    if (!email || !semester || !installment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, semester, and installment are required' 
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if payment record already exists for this semester and installment
    const existingPayment = await prisma.payment.findFirst({
      where: {
        userId: user.id,
        semester,
        installment
      }
    });

    if (existingPayment) {
      // Update existing record (don't include updatedAt - Prisma handles it automatically)
      const updatedPayment = await prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          status: 'pending'
        }
      });

      return res.status(200).json({
        success: true,
        message: 'Form data updated successfully',
        payment: updatedPayment
      });
    } else {
      // Create new payment record
      const newPayment = await prisma.payment.create({
        data: {
          userId: user.id,
          semester,
          installment,
          status: 'pending'
        }
      });

      return res.status(200).json({
        success: true,
        message: 'Form data saved successfully',
        payment: newPayment
      });
    }
  } catch (error) {
    console.error('Error saving form data:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to save form data' 
    });
  }
});

// POST: Paystack webhook handler
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    console.log("Webhook received:", req.body);

    const { event, data } = req.body;

    // Only handle charge.success events
    if (event === "charge.success") {
      const { customer, reference, status, amount } = data;
      const { email, first_name, last_name, phone } = customer;

      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: "Email is required" 
        });
      }

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      // Find the most recent pending payment for this user
      const pendingPayment = await prisma.payment.findFirst({
        where: {
          userId: user.id,
          status: 'pending'
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (pendingPayment) {
        // Update existing payment record
        const updatedPayment = await prisma.payment.update({
          where: { id: pendingPayment.id },
          data: {
            firstName: first_name,
            lastName: last_name,
            phoneNumber: phone,
            status: status === "success" ? "paid" : "failed",
            amount: amount / 100,
            amountPaid: amount / 100,
            transactionId: reference
          }
        });

        return res.status(200).json({
          success: true,
          message: "Transaction details updated successfully",
          payment: updatedPayment
        });
      } else {
        // Create new payment record for successful payment
        const newPayment = await prisma.payment.create({
          data: {
            userId: user.id,
            firstName: first_name,
            lastName: last_name,
            phoneNumber: phone,
            status: "paid",
            amount: amount / 100,
            amountPaid: amount / 100,
            transactionId: reference,
            semester: "Unknown",
            installment: "Unknown"
          }
        });

        return res.status(200).json({
          success: true,
          message: "Transaction details saved successfully",
          payment: newPayment
        });
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: "Webhook received" 
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({ 
      success: false,
      message: "An error occurred while processing the webhook",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// GET: Get payment details by email
router.get('/payment-details/:email', async (req: Request, res: Response) => {
  const { email } = req.params;
  const emailStr = getEmailString(email);

  try {
    if (!emailStr) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: emailStr },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        payments: user.payments
      }
    });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch payment details" 
    });
  }
});

// GET: Get payment status for fees page (formatted for frontend)
router.get('/payment-status/:email', async (req: Request, res: Response) => {
  const { email } = req.params;
  const emailStr = getEmailString(email);

  try {
    if (!emailStr) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: emailStr },
      include: {
        payments: true
      }
    });

    if (!user) {
      return res.status(200).json({});
    }

    // Transform payments into status object for frontend
    const paymentStatus: Record<string, Record<string, string>> = {};

    user.payments.forEach(payment => {
      if (payment.semester && payment.installment) {
        if (!paymentStatus[payment.semester]) {
          paymentStatus[payment.semester] = {};
        }
        paymentStatus[payment.semester][payment.installment] = 
          payment.status === "paid" ? "paid" : "pending";
      }
    });

    return res.status(200).json(paymentStatus);
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch payment status" 
    });
  }
});

// GET: Get all payments for a user
router.get('/payments/:email', async (req: Request, res: Response) => {
  const { email } = req.params;
  const emailStr = getEmailString(email);

  try {
    if (!emailStr) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: emailStr },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      payments: user.payments
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch payments" 
    });
  }
});

// PUT: Update payment record
router.put('/payments/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const idNum = getNumberId(id);
  const { status, amountPaid, transactionId } = req.body;

  try {
    if (!idNum) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid payment ID is required' 
      });
    }

    const payment = await prisma.payment.update({
      where: { id: idNum },
      data: {
        status,
        amountPaid: amountPaid ? parseFloat(amountPaid) : undefined,
        transactionId
      }
    });

    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      payment
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to update payment" 
    });
  }
});

export default router;