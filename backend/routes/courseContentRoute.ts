import express from "express";
import { PrismaClient, ContentStatus } from "@prisma/client";
import { upload, uploadToS3, deleteFromS3 } from "../config/s3";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from 'ffmpeg-static';
import { PassThrough } from "stream";
import AWS from "aws-sdk";
import fs from 'fs';
import path from 'path';
import os from 'os';

// Set the ffmpeg path to the static binary
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

const router = express.Router();
const prisma = new PrismaClient();


// Helper function to generate thumbnail from video buffer using temp files
const generateThumbnailWithTempFile = (videoBuffer: Buffer): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    // Create temp files
    const tempInputPath = path.join(os.tmpdir(), `video-${Date.now()}.mp4`);
    const tempOutputPath = path.join(os.tmpdir(), `thumb-${Date.now()}.jpg`);
    
    // Write video buffer to temp file
    fs.writeFileSync(tempInputPath, videoBuffer);
    
    ffmpeg(tempInputPath)
      .screenshots({
        count: 1,
        folder: os.tmpdir(),
        filename: path.basename(tempOutputPath),
        size: '320x240',
        timestamps: ['00:00:02'] // Take screenshot at 2 seconds
      })
      .on('end', () => {
        try {
          // Read the generated thumbnail
          const thumbnailBuffer = fs.readFileSync(tempOutputPath);
          
          // Clean up temp files
          if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
          if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
          
          resolve(thumbnailBuffer);
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (err) => {
        // Clean up on error
        if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
        if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
        reject(err);
      });
  });
};

// Helper function to upload buffer to S3
const uploadToS3FromBuffer = async (buffer: Buffer, key: string, contentType: string) => {
  const s3 = new AWS.S3({
    region: process.env.AWS_REGION!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  });

  const result = await s3
    .upload({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      // REMOVE ACL: 'public-read',
    })
    .promise();

  return {
    url: result.Location,
    key: key,
  };
};
// =====================
// GET COURSE CONTENT BY PROGRAM NAME
// =====================
router.get("/courses/:programName/content", async (req, res) => {
  try {
    const programName = req.params.programName;
    
    const content = await prisma.courseContent.findMany({
      where: { programName: programName },
      include: {
        assignment: true,
        uploadedBy: true,
      },
      orderBy: { order: "asc" },
    });

    const stats = {
      videos: content.filter((c) => c.type === "video").length,
      documents: content.filter((c) => c.type === "document").length,
      assignments: content.filter((c) => c.type === "assignment").length,
    };

    res.json({ success: true, content, stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch course content" });
  }
});

// =====================
// UPLOAD CONTENT WITH THUMBNAIL
// =====================
router.post("/upload-content", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const { programName, title, type, description, uploadedById, duration } = req.body;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    if (!programName || !title || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("Uploading:", { programName, title, type, fileSize: file.size });

    // Upload original file to S3
    const uploadResult = await uploadToS3(file, type);
    
    let thumbnailUrl = null;
    
    // Generate thumbnail for video files
    if (type === 'video') {
      try {
        console.log("Generating thumbnail for video...");
        const thumbnailBuffer = await generateThumbnailWithTempFile(file.buffer);
        
        // Upload thumbnail to S3
        const thumbnailFileName = `course-content/${type}/thumbnails/thumb-${Date.now()}.jpg`;
        const thumbnailUpload = await uploadToS3FromBuffer(thumbnailBuffer, thumbnailFileName, 'image/jpeg');
        thumbnailUrl = thumbnailUpload.url;
        console.log("Thumbnail generated and uploaded:", thumbnailUrl);
      } catch (error) {
        console.error("Thumbnail generation failed:", error);
        // Continue without thumbnail
      }
    }

    // Get the max order for this program
    let maxOrderResult;
    try {
      maxOrderResult = await prisma.courseContent.aggregate({
        where: { programName: programName },
        _max: { order: true },
      });
    } catch (error) {
      console.log("Note: programName might not exist in schema yet");
      maxOrderResult = { _max: { order: null } };
    }

    // Save to database
    const content = await prisma.courseContent.create({
      data: {
        programName: programName,
        title: title,
        type: type,
        description: description || null,
        fileUrl: uploadResult.url,
        thumbnailUrl: thumbnailUrl,
        fileSize: file.size,
        mimeType: file.mimetype,
        duration: duration || null,
        order: (maxOrderResult._max.order ?? -1) + 1,
        uploadedById: uploadedById ? parseInt(uploadedById) : null,
        status: ContentStatus.draft,
      },
    });

    res.json({
      success: true,
      content: content,
      file: uploadResult,
      thumbnail: thumbnailUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed: " + (error as Error).message });
  }
});

// =====================
// UPDATE CONTENT
// =====================
router.put("/courses/content/:contentId", async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId);
    const { title, description, type, duration, status, order } = req.body;

    const updated = await prisma.courseContent.update({
      where: { id: contentId },
      data: {
        title: title,
        description: description,
        type: type,
        duration: duration,
        status: status,
        order: order,
      },
    });

    res.json({ success: true, content: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Update failed" });
  }
});

// =====================
// DELETE CONTENT
// =====================
router.delete("/courses/content/:contentId", async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId);

    const content = await prisma.courseContent.findUnique({
      where: { id: contentId },
    });

    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    // Delete from S3 if file exists
    if (content.fileUrl) {
      await deleteFromS3(content.fileUrl);
    }
    
    // Delete thumbnail from S3 if exists
    if (content.thumbnailUrl) {
      await deleteFromS3(content.thumbnailUrl);
    }

    // Delete from database
    await prisma.courseContent.delete({
      where: { id: contentId },
    });

    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Delete failed" });
  }
});

// =====================
// UPDATE CONTENT STATUS
// =====================
router.patch("/courses/content/:contentId/status", async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId);
    const { status } = req.body;
    
    console.log(`Attempting to update content ${contentId} to status: ${status}`);
    
    // Check if content exists first
    const existingContent = await prisma.courseContent.findUnique({
      where: { id: contentId },
    });
    
    if (!existingContent) {
      console.log(`Content ${contentId} not found`);
      return res.status(404).json({ error: "Content not found" });
    }
    
    console.log(`Found content: ${existingContent.title}, current status: ${existingContent.status}`);
    
    // Update the status
    const updated = await prisma.courseContent.update({
      where: { id: contentId },
      data: { status: status },
    });
    
    console.log(`Successfully updated content ${contentId} to status: ${status}`);
    res.json({ success: true, content: updated });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ error: "Status update failed: " + (error as Error).message });
  }
});

// =====================
// GET SINGLE CONTENT
// =====================
router.get("/content/:contentId", async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId);
    
    const content = await prisma.courseContent.findUnique({
      where: { id: contentId },
      include: {
        assignment: true,
        uploadedBy: true,
      },
    });

    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.json({ success: true, content: content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fetch failed" });
  }
});

// =====================
// GET ALL CONTENT (Optional - for admin)
// =====================
router.get("/all-content", async (req, res) => {
  try {
    const content = await prisma.courseContent.findMany({
      include: {
        uploadedBy: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, content: content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

export default router;