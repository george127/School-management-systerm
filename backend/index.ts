import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoute from "./routes/auth";
import s3UploadRoutes from "./routes/s3_upload";
import studentFormsRoutes from "./routes/studentforms";
import studentPortalRoutes from "./routes/studentPortalRoutes";

const app = express();

const allowedOrigins = [
  "https://main.d2qiaka43ozgqd.amplifyapp.com",
  "https://e5s4hxpbwy.us-east-1.awsapprunner.com",
  "http://localhost:5000",
  "http://localhost:3000",
];

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

app.use("/api", authRoute);
app.use("/api/upload", s3UploadRoutes);
app.use("/api/forms", studentFormsRoutes);
app.use("/api", studentPortalRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});