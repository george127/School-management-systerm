import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express';import cors from "cors";
import authRoute from "./routes/auth.ts";
import s3UploadRoutes from './routes/s3_upload.ts';      
import studentFormsRoutes from './routes/studentforms.ts'; // Import student forms routes
   
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://main.d2qiaka43ozgqd.amplifyapp.com/"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
 
app.use(express.json({
  limit: "50mb"
}));

app.use(express.urlencoded({
  limit: "50mb",
  extended: true
}));

app.use("/api", authRoute);
app.use("/api/upload", s3UploadRoutes);
app.use("/api/forms", studentFormsRoutes); // Use student forms routes



app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
