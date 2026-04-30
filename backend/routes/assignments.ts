import express from "express";
import { PrismaClient } from "@prisma/client";
import { upload, uploadToS3, deleteFromS3 } from "../config/s3";

const router = express.Router();
const prisma = new PrismaClient();

// ============================================
// TEST ENDPOINT
// ============================================
router.get("/test", (req, res) => {
  res.json({ message: "Assignment routes are working!" });
});

// ============================================
// GET STUDENT BY EMAIL
// ============================================
router.get("/students/by-email", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const student = await prisma.student.findUnique({
      where: { email: email as string },
      select: {
        id: true,
        fullName: true,
        email: true,
        programName: true,
      },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Failed to fetch student" });
  }
});

// ============================================
// GET ASSIGNMENT DETAILS
// ============================================
router.get("/content/:contentId/details", async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId);
    const { email } = req.query;

    const content = await prisma.courseContent.findUnique({
      where: { id: contentId },
    });

    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    if (content.type !== "assignment") {
      return res.status(400).json({ error: "This content is not an assignment" });
    }

    let studentId = null;
    if (email) {
      const student = await prisma.student.findUnique({
        where: { email: email as string },
        select: { id: true },
      });
      if (student) studentId = student.id;
    }

    let existingSubmission = null;
    if (studentId) {
      const submission = await prisma.assignmentSubmission.findFirst({
        where: {
          assignmentId: contentId,
          studentId: studentId,
        },
        orderBy: { attemptNumber: "desc" },
      });

      if (submission) {
        existingSubmission = {
          id: submission.id,
          submissionUrl: submission.submissionUrl,
          submissionText: submission.submissionText,
          grade: submission.grade,
          feedback: submission.feedback,
          status: submission.status,
          attemptNumber: submission.attemptNumber,
          submittedAt: submission.submittedAt,
        };
      }
    }

    res.json({
      success: true,
      contentId: content.id,
      title: content.title,
      assignmentId: content.id,
      description: content.description,
      instructions: content.description,
      dueDate: null,
      maxPoints: null,
      passingScore: null,
      allowedAttempts: 1,
      submission: existingSubmission,
    });
  } catch (error) {
    console.error("Error fetching assignment details:", error);
    res.status(500).json({ error: "Failed to fetch assignment details" });
  }
});

// ============================================
// SUBMIT ASSIGNMENT
// ============================================
router.post("/submit", upload.single("file"), async (req, res) => {
  try {
    console.log("=== SUBMIT ROUTE STARTED ===");

    const { contentId, email, submissionText } = req.body;
    const file = req.file;

    if (!contentId || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const student = await prisma.student.findUnique({
      where: { email: email },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const content = await prisma.courseContent.findUnique({
      where: { id: parseInt(contentId) },
    });

    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    if (content.type !== "assignment") {
      return res.status(400).json({ error: "This content is not an assignment" });
    }

    const existingSubmission = await prisma.assignmentSubmission.findFirst({
      where: {
        assignmentId: content.id,
        studentId: student.id,
      },
      orderBy: { attemptNumber: "desc" },
    });

    if (existingSubmission && existingSubmission.submissionUrl) {
      try {
        await deleteFromS3(existingSubmission.submissionUrl);
      } catch (deleteError) {
        console.error("Error deleting old file:", deleteError);
      }
    }

    let submissionUrl = null;
    if (file) {
      try {
        const uploadResult = await uploadToS3(file, "submitted-assignments");
        submissionUrl = uploadResult.url;
      } catch (s3Error) {
        console.error("S3 Upload Error:", s3Error);
        return res.status(500).json({ error: "File upload failed" });
      }
    }

    let submission;
    let isResubmit = false;

    if (existingSubmission) {
      isResubmit = true;
      submission = await prisma.assignmentSubmission.update({
        where: { id: existingSubmission.id },
        data: {
          submissionUrl: submissionUrl,
          submissionText: submissionText || null,
          submittedAt: new Date(),
          status: "submitted",
          attemptNumber: existingSubmission.attemptNumber + 1,
          grade: null,
          feedback: null,
          gradedBy: null,
          gradedAt: null,
        },
      });
    } else {
      submission = await prisma.assignmentSubmission.create({
        data: {
          assignmentId: content.id,
          studentId: student.id,
          submissionUrl: submissionUrl,
          submissionText: submissionText || null,
          attemptNumber: 1,
          status: "submitted",
        },
      });
    }

    // Create notifications for admins (NO top-level await)
    try {
      const admins = await prisma.user.findMany({
        where: { role: "admin" },
        select: { id: true },
      });

      if (admins.length > 0) {
        await prisma.assignmentNotification.createMany({
          data: admins.map((admin) => ({
            adminId: admin.id,
            submissionId: submission.id,
            studentName: student.fullName,
            assignmentTitle: content.title,
            programName: content.programName,
            read: false,
          })),
        });
        console.log(`✅ Notifications created for ${admins.length} admins`);
      }
    } catch (notifError) {
      console.error("Error creating notifications:", notifError);
    }

    // Mark content as completed
    try {
      let enrollment = null;
      if (content.courseId) {
        enrollment = await prisma.enrollment.findFirst({
          where: { studentId: student.id, courseId: content.courseId },
        });
      }
      if (!enrollment) {
        enrollment = await prisma.enrollment.findFirst({
          where: { studentId: student.id },
        });
      }

      if (enrollment) {
        await prisma.contentProgress.upsert({
          where: {
            enrollmentId_contentId: {
              enrollmentId: enrollment.id,
              contentId: content.id,
            },
          },
          update: { isCompleted: true, completedAt: new Date() },
          create: {
            enrollmentId: enrollment.id,
            contentId: content.id,
            isCompleted: true,
            completedAt: new Date(),
          },
        });
      }
    } catch (progressError) {
      console.error("Progress update error:", progressError);
    }

    res.json({
      success: true,
      message: isResubmit
        ? "Assignment resubmitted successfully!"
        : "Assignment submitted successfully!",
      submission: {
        id: submission.id,
        attemptNumber: submission.attemptNumber,
        status: submission.status,
        submittedAt: submission.submittedAt,
      },
    });
  } catch (error: any) {
    console.error("Submission error:", error);
    res.status(500).json({ error: error.message || "Failed to submit assignment" });
  }
});

// ============================================
// GET STUDENT SUBMISSIONS
// ============================================
router.get("/student/:email/submissions", async (req, res) => {
  try {
    const { email } = req.params;

    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const submissions = await prisma.assignmentSubmission.findMany({
      where: { studentId: student.id },
      orderBy: { submittedAt: "desc" },
    });

    const submissionsWithContent = await Promise.all(
      submissions.map(async (submission) => {
        const content = await prisma.courseContent.findUnique({
          where: { id: submission.assignmentId },
          select: { id: true, title: true, description: true, type: true },
        });
        return { ...submission, content };
      })
    );

    res.json({ success: true, submissions: submissionsWithContent });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// ============================================
// ADMIN: GRADE SUBMISSION
// ============================================
router.put("/grade/:submissionId", async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback, gradedBy } = req.body;

    const submission = await prisma.assignmentSubmission.update({
      where: { id: parseInt(submissionId) },
      data: {
        grade: grade ? parseFloat(grade) : null,
        feedback: feedback || null,
        gradedBy: gradedBy ? parseInt(gradedBy) : null,
        gradedAt: new Date(),
        status: "graded",
      },
    });

    res.json({ success: true, message: "Assignment graded successfully", submission });
  } catch (error) {
    console.error("Error grading:", error);
    res.status(500).json({ error: "Failed to grade submission" });
  }
});

// ============================================
// ADMIN: GET ALL SUBMISSIONS WITH PAGINATION
// ============================================
router.get("/admin/submissions", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const programName = req.query.program as string;
    const status = req.query.status as string;

    let whereConditions: any = {};

    if (programName && programName !== "all") {
      const programContents = await prisma.courseContent.findMany({
        where: { programName: programName },
        select: { id: true },
      });
      const contentIds = programContents.map(c => c.id);
      whereConditions.assignmentId = { in: contentIds };
    }

    if (status && status !== "all") {
      whereConditions.status = status;
    }

    const total = await prisma.assignmentSubmission.count({ where: whereConditions });

    const submissions = await prisma.assignmentSubmission.findMany({
      where: whereConditions,
      include: {
        student: { select: { id: true, fullName: true, email: true, programName: true } },
      },
      orderBy: { submittedAt: "desc" },
      skip,
      take: limit,
    });

    const submissionsWithContent = await Promise.all(
      submissions.map(async (submission) => {
        const content = await prisma.courseContent.findUnique({
          where: { id: submission.assignmentId },
          select: { id: true, title: true, description: true, type: true, programName: true },
        });
        return { ...submission, content };
      })
    );

    res.json({
      success: true,
      submissions: submissionsWithContent,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// ============================================
// ADMIN: GET NOTIFICATIONS
// ============================================
router.get("/notifications", async (req, res) => {
  try {
    const adminId = parseInt(req.query.adminId as string);
    const limit = parseInt(req.query.limit as string) || 20;
    const unreadOnly = req.query.unreadOnly === "true";

    const where: any = { adminId };
    if (unreadOnly) where.read = false;

    const notifications = await prisma.assignmentNotification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const unreadCount = await prisma.assignmentNotification.count({
      where: { adminId, read: false },
    });

    res.json({ success: true, notifications, unreadCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});
 
// ============================================
// ADMIN: MARK NOTIFICATION AS READ
// ============================================
router.put("/notifications/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.assignmentNotification.update({
      where: { id: parseInt(id) },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

// ============================================
// ADMIN: MARK ALL NOTIFICATIONS AS READ
// ============================================
router.put("/notifications/mark-all-read", async (req, res) => {
  try {
    const { adminId } = req.body;
    await prisma.assignmentNotification.updateMany({
      where: { adminId, read: false },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Error marking all as read:", error);
    res.status(500).json({ error: "Failed to mark all as read" });
  }
});

// GET single submission by ID
router.get("/submission/:submissionId", async (req, res) => {
  try {
    const submissionId = parseInt(req.params.submissionId);
    
    const submission = await prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            email: true,
            programName: true,
          },
        },
      },
    });
    
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }
    
    // Get content info
    const content = await prisma.courseContent.findUnique({
      where: { id: submission.assignmentId },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        programName: true,
      },
    });
    
    res.json({ 
      success: true, 
      submission: { ...submission, content } 
    });
  } catch (error) {
    console.error("Error fetching submission:", error);
    res.status(500).json({ error: "Failed to fetch submission" });
  }
});

export default router;   