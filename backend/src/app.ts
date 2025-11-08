import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { config } from "./config/env";
import { logger } from "./utils/logger";

// Import routes
import authRoutes from "./routes/authRoutes";
import collegeRoutes from "./routes/collegeRoutes";
import hackathonRoutes from "./routes/hackathonRoutes";
import problemRoutes from "./routes/problemRoutes";
import quizRoutes from "./routes/quizRoutes";
import userRoutes from "./routes/userRoutes";
import weeklyTestRoutes from "./routes/weeklyTestRoutes";
import interviewRoutes from "./routes/interviewRoutes";
import avatarRoutes from "./routes/avatarRoutes";

// Error middleware
import { errorHandler } from "./middleware/errorMiddleware";

const app: Application = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public")));

// Middleware
app.use(express.json());
app.use(cookieParser());
const allowedOriginsFromEnv = (config.ALLOWED_ORIGINS || "").split(",").filter(Boolean);
const hardcodedOrigins = ["https://www.codersplace.in", "https://codersplace.in"];
const allowedOrigins = [...new Set([...allowedOriginsFromEnv, ...hardcodedOrigins])];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

logger.info(`CORS enabled for origins: ${allowedOrigins.join(",")}`);

app.get("/", (req, res) => {
  res.status(200).json({ message: "CodersPlace Backend is running successfully 🚀" });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/college", collegeRoutes);
app.use("/api/v1/hackathon", hackathonRoutes);
app.use("/api/v1/problem", problemRoutes);
app.use("/api/v1/quiz", quizRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/weekly-test", weeklyTestRoutes);
app.use("/api/v1/interview", interviewRoutes);
app.use("/api/v1/avatar", avatarRoutes);

// Catch-all route for debugging
app.use((req, res, next) => {
  logger.warn(`Unhandled route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Error Handler
app.use(errorHandler);

export default app;