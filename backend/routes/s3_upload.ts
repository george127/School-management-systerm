// backend/routes/s3_upload.ts
import express from 'express';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// POST endpoint for file upload
router.post('/', async (req, res) => {  // ← Changed to router.post
  try {
    // For file uploads, you need multer or similar
    // This is simplified - you'll need to handle multipart/form-data
    const file = req.file; // You'll need multer for this
    
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        message: 'Invalid file type. Only JPEG, PNG, JPG, and WEBP are allowed.' 
      });
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ 
        message: 'File size too large. Maximum size is 5MB.' 
      });
    }

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `profile-images/${uuidv4()}.${fileExtension}`;

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);

    // Construct the S3 URL
    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return res.json({
      message: 'File uploaded successfully',
      imageUrl,
    });

  } catch (error) {
    console.error('S3 Upload Error:', error);
    return res.status(500).json({ message: 'Failed to upload file to S3' });
  }
});

// GET endpoint for presigned URL
router.get('/', async (req, res) => {
  try {
    const { fileName, fileType } = req.query;

    if (!fileName || !fileType) {
      return res.status(400).json({ message: 'Missing fileName or fileType' });
    }

    // Generate unique filename
    const fileExtension = (fileName as string).split('.').pop();
    const key = `profile-images/${uuidv4()}.${fileExtension}`;

    // Create presigned URL
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      ContentType: fileType as string,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return res.json({
      presignedUrl,
      imageUrl,
      key,
    });

  } catch (error) {
    console.error('Presigned URL Error:', error);
    return res.status(500).json({ message: 'Failed to generate presigned URL' });
  }
});

export default router; // ← Export the router