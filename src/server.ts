import express from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import campaignLeadRouter from "./routes/campaignLead.routes.js";
import userRoutes from "./routes/user.routes.js";
import whatsappRoutes from "./routes/whatsapp.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import serviceRoutes from "./routes/services.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import leadsRoutes from "./routes/leads.routes.js";

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
app.use(cookieParser());

/* =========================
   🚀 Routes
========================= */

// Health check / API running check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CARZSPAS API is running successfully!",
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/campaign-leads", campaignLeadRouter);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leads", leadsRoutes);

/* =========================
   🛠️ Error Handling
========================= */
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
