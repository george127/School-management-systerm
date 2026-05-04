// backend/routes/studentManagement.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Helper function to get string from query parameter (handles ParsedQs type)
const getStringQuery = (param: string | string[] | undefined | any): string => {
  if (!param) return '';
  if (Array.isArray(param)) {
    return param[0] || '';
  }
  if (typeof param === 'object') {
    // Handle ParsedQs object
    return param.toString() || '';
  }
  return param.toString();
};

const getNumberQuery = (param: string | string[] | undefined | any, defaultValue: number): number => {
  const value = getStringQuery(param);
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Helper function to get ID from params
const getParamId = (id: string | string[] | undefined): number => {
  const idStr = Array.isArray(id) ? id[0] : id;
  return parseInt(idStr || '');
};

// GET /students - Get all students with pagination and search
router.get('/students', async (req: Request, res: Response) => {
  try {
    const page = getNumberQuery(req.query.page, 1);
    const limit = getNumberQuery(req.query.limit, 10);
    const skip = (page - 1) * limit;
    const search = getStringQuery(req.query.search);
    const status = getStringQuery(req.query.status);

    // Build where clause
    let whereClause: any = {};

    if (search) {
      whereClause = {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ]
      };
    }

    // Get total count
    const total = await prisma.student.count({ where: whereClause });

    // Get students with pagination
    const students = await prisma.student.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
          }
        },
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    });

    // Filter by status if needed
    let filteredStudents = students;
    if (status !== 'all' && status !== '') {
      filteredStudents = students.filter(student => 
        status === 'active' ? student.user?.isActive === true : student.user?.isActive === false
      );
    }

    // Transform data to match frontend expected format
    const formattedStudents = filteredStudents.map(student => ({
      id: student.id,
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
      profileImage: student.profileImage,
      gender: student.gender,
      status: student.user?.isActive ? 'active' : 'inactive',
      enrollments: student.enrollments,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      students: formattedStudents,
      pagination: {
        page,
        limit,
        total: filteredStudents.length,
        totalPages: Math.ceil(filteredStudents.length / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
 
// GET /students/stats - Get student statistics
router.get('/students/stats', async (req: Request, res: Response) => {
  try {
    // Get total students count
    const totalStudents = await prisma.student.count();

    // Get active students (users with isActive = true)
    const activeStudents = await prisma.student.count({
      where: {
        user: {
          isActive: true
        }
      }
    });

    // Get inactive students
    const inactiveStudents = totalStudents - activeStudents;

    // Get total enrollments
    const totalEnrollments = await prisma.enrollment.count();

    return res.status(200).json({
      success: true,
      totalStudents,
      activeStudents,
      inactiveStudents,
      totalEnrollments
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /students/:id - Get single student details
router.get('/students/:id', async (req: Request, res: Response) => {
  try {
    const studentId = getParamId(req.params.id);

    if (isNaN(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
            role: true,
          }
        },
        enrollments: {
          include: {
            course: {
              include: {
                program: true,
                instructor: {
                  select: {
                    name: true,
                    email: true,
                  }
                }
              }
            },
            contentProgress: {
              include: {
                content: true
              }
            }
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    return res.status(200).json({
      success: true,
      student: {
        ...student,
        status: student.user?.isActive ? 'active' : 'inactive',
      }
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /students - Create new student
router.post('/students', async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      nationality,
      dob,
      gender,
      profileImage,
      programName,
      courseDetails,
      qualification,
      institution,
      graduationYear,
      studyArea,
      certifications,
      guardianFullName,
      relationship,
      guardianPhone,
      guardianEmail,
      guardianOccupation,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone) {
      return res.status(400).json({ error: 'Full name, email, and phone are required' });
    }

    // Check if student already exists
    const existingStudent = await prisma.student.findUnique({
      where: { email }
    });

    if (existingStudent) {
      return res.status(400).json({ error: 'Student with this email already exists' });
    }

    // Create student
    const student = await prisma.student.create({
      data: {
        fullName,
        email,
        phone,
        address: address || '',
        nationality: nationality || '',
        dob: dob ? new Date(dob) : new Date(),
        gender,
        profileImage: profileImage || '',
        programName: programName || '',
        courseDetails: courseDetails || '',
        qualification: qualification || '',
        institution: institution || '',
        graduationYear: graduationYear ? parseInt(graduationYear) : null,
        studyArea: studyArea || '',
        certifications: certifications || '',
        guardianFullName: guardianFullName || '',
        relationship: relationship || '',
        guardianPhone: guardianPhone || '',
        guardianEmail: guardianEmail || '',
        guardianOccupation: guardianOccupation || '',
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Student created successfully',
      student
    });
  } catch (error) {
    console.error('Error creating student:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /students/:id - Update student
router.put('/students/:id', async (req: Request, res: Response) => {
  try {
    const studentId = getParamId(req.params.id);
    
    if (isNaN(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    const updateData = req.body;
    
    // Remove id from update data if present
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!existingStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Convert dob if present
    if (updateData.dob) {
      updateData.dob = new Date(updateData.dob);
    }

    // Convert graduationYear if present
    if (updateData.graduationYear) {
      updateData.graduationYear = parseInt(updateData.graduationYear);
    }

    const student = await prisma.student.update({
      where: { id: studentId },
      data: updateData,
      include: {
        user: {
          select: {
            isActive: true
          }
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      student: {
        ...student,
        status: student.user?.isActive ? 'active' : 'inactive',
      }
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /students/:id/status - Toggle student status
router.patch('/students/:id/status', async (req: Request, res: Response) => {
  try {
    const studentId = getParamId(req.params.id);
    const { status } = req.body;

    if (isNaN(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Valid status (active/inactive) is required' });
    }

    // Find the student to get the userId
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (!student.user) {
      return res.status(400).json({ error: 'Student has no user account' });
    }

    // Update user's isActive status
    const updatedUser = await prisma.user.update({
      where: { id: student.user.id },
      data: { isActive: status === 'active' }
    });

    return res.status(200).json({
      success: true,
      message: `Student status updated to ${status}`,
      status: updatedUser.isActive ? 'active' : 'inactive'
    });
  } catch (error) {
    console.error('Error updating student status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /students/:id - Delete student
router.delete('/students/:id', async (req: Request, res: Response) => {
  try {
    const studentId = getParamId(req.params.id);

    if (isNaN(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        enrollments: true,
        assignmentSubmissions: true,
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Delete related records first
    // Delete content progress through enrollments
    for (const enrollment of student.enrollments) {
      await prisma.contentProgress.deleteMany({
        where: { enrollmentId: enrollment.id }
      });
    }

    // Delete enrollments
    await prisma.enrollment.deleteMany({
      where: { studentId: studentId }
    });

    // Delete assignment submissions
    await prisma.assignmentSubmission.deleteMany({
      where: { studentId: studentId }
    });

    // Delete payments if they exist
    if (student.userId) {
      await prisma.payment.deleteMany({
        where: { userId: student.userId }
      });
    }

    // Delete the student
    await prisma.student.delete({
      where: { id: studentId }
    });

    // If student has a user account, deactivate it
    if (student.userId) {
      await prisma.user.update({
        where: { id: student.userId },
        data: { isActive: false }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /students/search - Search students
router.get('/students/search', async (req: Request, res: Response) => {
  try {
    const query = getStringQuery(req.query.q);
    const page = getNumberQuery(req.query.page, 1);
    const limit = getNumberQuery(req.query.limit, 10);
    const skip = (page - 1) * limit;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const students = await prisma.student.findMany({
      where: {
        OR: [
          { fullName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
        ]
      },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            isActive: true
          }
        },
        enrollments: {
          take: 5
        }
      }
    });

    const total = await prisma.student.count({
      where: {
        OR: [
          { fullName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
        ]
      }
    });

    const formattedStudents = students.map(student => ({
      id: student.id,
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
      profileImage: student.profileImage,
      status: student.user?.isActive ? 'active' : 'inactive',
      enrollmentsCount: student.enrollments.length
    }));

    return res.status(200).json({
      success: true,
      students: formattedStudents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error searching students:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;