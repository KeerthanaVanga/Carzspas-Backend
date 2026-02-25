import express from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
const PORT = process.env.PORT || 5000;

/* =========================
   🔐 Security Middlewares
========================= */

// Helmet (adds secure HTTP headers)
app.use(helmet());

// Rate Limiting (basic global limiter)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

/* =========================
   🌍 CORS
========================= */

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
