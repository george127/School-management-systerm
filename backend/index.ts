import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoute from "./routes/auth";
import s3UploadRoutes from "./routes/s3_upload";
import studentFormsRoutes from "./routes/studentforms";
import studentPortalRoutes from "./routes/studentPortalRoutes";
import feesPaymentRoutes from './routes/feesPaymentRoutes';
import studentProfileRoutes from './routes/studentProfile';
import forgotpasswordRoutes from './routes/forgotpassword';
import paymentInfoRoutes from './routes/paymentInfo';

const app = express();
const prisma = new PrismaClient();

const allowedOrigins = [
  "https://main.d2qiaka43ozgqd.amplifyapp.com",
  "https://e5s4hxpbwy.us-east-1.awsapprunner.com",
  "http://localhost:5000",
  "http://localhost:3000",
];

// Test database connection on startup
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
    console.log("✅ Database query test passed:", result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Database connection failed:", errorMessage);
    // Don't crash the app, just log the error
  }
}

// Call database test on startup
testDatabaseConnection();

app.get("/", (req, res) => {
  res.json({
    message: "School Management System API is running",
    status: "ok",
  });
});

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('Blocked origin:', origin);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

// Add this endpoint to test database connection
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW() as current_time, version() as pg_version`;
    res.json({
      success: true,
      message: "Database connected successfully!",
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Database connection error:", errorMessage);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
});

// Add endpoint to check database tables (optional)
app.get("/api/db-tables", async (req, res) => {
  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    res.json({
      success: true,
      tables: tables,
      count: Array.isArray(tables) ? tables.length : 0
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

app.get("/api/delete-all-data", async (req, res) => {
  try {
    const deletedData = {};
    
    // Delete in order: child tables first, then parent tables
    // Payment depends on Student? Check relationships
    const tablesInOrder = ["Payment", "Student", "User"];
    
    for (const table of tablesInOrder) {
      const result = await prisma.$queryRawUnsafe(
        `DELETE FROM "${table}" RETURNING *`
      );
      deletedData[table] = {
        count: Array.isArray(result) ? result.length : 0,
        data: result
      };
    }
    
    res.json({
      message: "All data deleted successfully",
      deletedData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ 
      error: error.message,
      hint: "Check foreign key constraints - tables must be deleted in correct order"
    });
  }
});

app.use("/api", authRoute);
app.use("/api/upload", s3UploadRoutes);
app.use("/api/forms", studentFormsRoutes);
app.use("/api", studentPortalRoutes);
app.use("/api/fees", feesPaymentRoutes);
app.use("/api", studentProfileRoutes);
app.use("/api", forgotpasswordRoutes);
app.use("/api/payment-info", paymentInfoRoutes);


// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('========== ERROR ==========');
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  console.error('===========================');
  
  res.status(500).json({ 
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});