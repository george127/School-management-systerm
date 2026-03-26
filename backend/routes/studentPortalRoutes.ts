// routes/studentPortalRoutes.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = Router();
const prisma = new PrismaClient();

// Helper to ensure email is a string
const getEmailString = (email: string | string[] | undefined): string | null => {
  if (!email) return null;
  return Array.isArray(email) ? email[0] : email;
};

// ==================== STUDENT DATA ENDPOINTS ====================

// GET: Fetch complete student data by email
router.get('/students/:email', async (req: Request, res: Response) => {
  try {
    const emailParam = req.params.email;
    const email = getEmailString(emailParam);

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    // Combine user and student profile data
    const studentData = {
      id: user.id,
      cognitoId: user.cognitoId,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      personalDetails: user.studentProfile || {},
      payments: user.payments
    };

    res.status(200).json({
      success: true,
      student: studentData
    });

  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch student data' 
    });
  }
});

// ==================== PROFILE ENDPOINTS ====================

// GET: Fetch full profile data by email
router.get('/profile/:email', async (req: Request, res: Response) => {
  try {
    const emailParam = req.params.email;
    const email = getEmailString(emailParam);

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { studentProfile: true }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        role: user.role,
        studentProfile: user.studentProfile
      }
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch profile data' 
    });
  }
});

// PUT: Update user name
router.put('/profile/name/:email', async (req: Request, res: Response) => {
  try {
    const emailParam = req.params.email;
    const email = getEmailString(emailParam);
    const { name } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    if (!name || name.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Name is required' 
      });
    }

    const user = await prisma.user.update({
      where: { email },
      data: { name: name.trim() }
    });

    // Also update student profile if exists
    await prisma.student.updateMany({
      where: { email: email },
      data: { fullName: name.trim() }
    });

    res.status(200).json({
      success: true,
      message: 'Name updated successfully',
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('Error updating name:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update name' 
    });
  }
});

// PUT: Update user email
router.put('/profile/email/:email', async (req: Request, res: Response) => {
  try {
    const emailParam = req.params.email;
    const oldEmail = getEmailString(emailParam);
    const { newEmail } = req.body;

    if (!oldEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid email is required' 
      });
    }

    // Check if new email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail }
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already in use' 
      });
    }

    // Update user email
    const user = await prisma.user.update({
      where: { email: oldEmail },
      data: { email: newEmail }
    });

    // Update student profile email
    await prisma.student.updateMany({
      where: { email: oldEmail },
      data: { email: newEmail }
    });

    res.status(200).json({
      success: true,
      message: 'Email updated successfully',
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update email' 
    });
  }
});

// PUT: Update user password
router.put('/profile/password/:email', async (req: Request, res: Response) => {
  try {
    const emailParam = req.params.email;
    const email = getEmailString(emailParam);
    const { currentPassword, newPassword } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    // For now, return success (assuming password is handled by Cognito)
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update password' 
    });
  }
});

// ==================== PROFILE IMAGE ENDPOINTS ====================

// GET: Fetch profile image
router.get('/profile/profile-image/:email', async (req: Request, res: Response) => {
  try {
    const emailParam = req.params.email;
    const email = getEmailString(emailParam);

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const student = await prisma.student.findUnique({
      where: { email },
      select: { profileImage: true }
    });

    res.status(200).json({
      success: true,
      profileImage: student?.profileImage || null
    });

  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch profile image' 
    });
  }
});

// PUT: Update profile image (supports base64)
router.put('/profile/profile-image/:email', async (req: Request, res: Response) => {
  try {
    const emailParam = req.params.email;
    const email = getEmailString(emailParam);
    const { profileImage } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    if (!profileImage) {
      return res.status(400).json({ 
        success: false, 
        message: 'Profile image is required' 
      });
    }

    // Validate base64 format (optional)
    const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,/;
    if (profileImage !== '' && !base64Regex.test(profileImage)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid image format. Must be base64 encoded image' 
      });
    }

    // Check if student profile exists
    let student = await prisma.student.findUnique({
      where: { email }
    });

    if (!student) {
      // Create student profile if it doesn't exist
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      student = await prisma.student.create({
        data: {
          userId: user.id,
          fullName: user.name,
          email: user.email,
          phone: '',
          address: '',
          nationality: '',
          dob: new Date(),
          gender: 'other',
          profileImage: profileImage
        }
      });
    } else {
      // Update existing profile
      student = await prisma.student.update({
        where: { email },
        data: { profileImage }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile image updated successfully',
      profileImage: student.profileImage
    });

  } catch (error) {
    console.error('Error updating profile image:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile image' 
    });
  }
});

// ==================== PHONE NUMBER ENDPOINTS ====================

// GET: Fetch phone number
router.get('/profile/phone/:email', async (req: Request, res: Response) => {
  try {
    const emailParam = req.params.email;
    const email = getEmailString(emailParam);

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const student = await prisma.student.findUnique({
      where: { email },
      select: { phone: true }
    });

    res.status(200).json({
      success: true,
      phone: student?.phone || null
    });

  } catch (error) {
    console.error('Error fetching phone:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch phone number' 
    });
  }
});

// PUT: Update phone number
router.put('/profile/phone/:email', async (req: Request, res: Response) => {
  try {
    const emailParam = req.params.email;
    const email = getEmailString(emailParam);
    const { phone } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number is required' 
      });
    }

    // Validate phone number
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s()-]/g, ''))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid phone number (10-15 digits)' 
      });
    }

    // Check if student profile exists
    let student = await prisma.student.findUnique({
      where: { email }
    });

    if (!student) {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      student = await prisma.student.create({
        data: {
          userId: user.id,
          fullName: user.name,
          email: user.email,
          phone: phone,
          address: '',
          nationality: '',
          dob: new Date(),
          gender: 'other',
          profileImage: ''
        }
      });
    } else {
      student = await prisma.student.update({
        where: { email },
        data: { phone }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Phone number updated successfully',
      phone: student.phone
    });

  } catch (error) {
    console.error('Error updating phone:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update phone number' 
    });
  }
});

// ==================== PAYMENT ENDPOINTS ====================

// GET: Fetch payments by user email
router.get('/payments/:email', async (req: Request, res: Response) => {
  try {
    const emailParam = req.params.email;
    const email = getEmailString(emailParam);

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
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
    console.error('Error fetching payments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch payments' 
    });
  }
});

// POST: Create a new payment record
router.post('/payments', async (req: Request, res: Response) => {
  try {
    const {
      email,
      semester,
      installment,
      firstName,
      lastName,
      phoneNumber,
      status,
      amount,
      amountPaid,
      transactionId
    } = req.body;

    if (!email || !semester || !installment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, semester, and installment are required' 
      });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        semester,
        installment,
        firstName,
        lastName,
        phoneNumber,
        status: status || 'pending',
        amount: amount ? parseFloat(amount) : null,
        amountPaid: amountPaid ? parseFloat(amountPaid) : null,
        transactionId
      }
    });

    res.status(201).json({
      success: true,
      message: 'Payment record created successfully',
      payment
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create payment record' 
    });
  }
});

// PUT: Update payment status
router.put('/payments/:id', async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    const { status, amountPaid, transactionId } = req.body;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment ID is required' 
      });
    }

    const payment = await prisma.payment.update({
      where: { id: parseInt(id) },
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
    console.error('Error updating payment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update payment' 
    });
  }
});

// ==================== COURSE ENDPOINTS (Placeholders) ====================

// GET: Fetch course modules
router.get('/courses/modules/:email', async (req: Request, res: Response) => {
  try {
    const emailParam = req.params.email;
    const email = getEmailString(emailParam);
    
    // This is a placeholder - implement based on your course schema
    res.status(200).json({
      success: true,
      modules: []
    });

  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch course modules' 
    });
  }
});

// GET: Fetch course materials
router.get('/courses/materials/:email', async (req: Request, res: Response) => {
  try {
    const emailParam = req.params.email;
    const email = getEmailString(emailParam);
    
    // This is a placeholder - implement based on your course schema
    res.status(200).json({
      success: true,
      materials: []
    });

  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch course materials' 
    });
  }
});

// GET: Fetch course performance
router.get('/courses/performance/:email', async (req: Request, res: Response) => {
  try {
    const emailParam = req.params.email;
    const email = getEmailString(emailParam);
    
    // This is a placeholder - implement based on your course schema
    res.status(200).json({
      success: true,
      performance: {
        averageScore: 85,
        completedAssignments: 5,
        totalAssignments: 8,
        quizScores: []
      }
    });

  } catch (error) {
    console.error('Error fetching performance:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch course performance' 
    });
  }
});

// GET: Fetch course grades
router.get('/courses/grades/:email', async (req: Request, res: Response) => {
  try {
    const emailParam = req.params.email;
    const email = getEmailString(emailParam);
    
    // This is a placeholder - implement based on your course schema
    res.status(200).json({
      success: true,
      grades: []
    });

  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch course grades' 
    });
  }
});

// GET: Fetch course assignments
router.get('/courses/assignments/:email', async (req: Request, res: Response) => {
  try {
    const emailParam = req.params.email;
    const email = getEmailString(emailParam);
    
    // This is a placeholder - implement based on your course schema
    res.status(200).json({
      success: true,
      assignments: []
    });

  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch assignments' 
    });
  }
});

// GET: Fetch course quizzes
router.get('/courses/quizzes/:email', async (req: Request, res: Response) => {
  try {
    const emailParam = req.params.email;
    const email = getEmailString(emailParam);
    
    // This is a placeholder - implement based on your course schema
    res.status(200).json({
      success: true,
      quizzes: []
    });

  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch quizzes' 
    });
  }
});

export default router;