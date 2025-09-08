// server/src/server.js
import express from "express";
import dotenv from "dotenv";
import { corsMiddleware } from "./middleware/cors.js";
import { authenticateUser } from "./middleware/authMiddleware.js";
import routes from "./routes/index.js";
import authRoutes from "./routes/authRoutes.js";
import absenceRoutes from "./routes/absenceRoute.js"; 
import dashboardRoutes from './routes/dashboardRoutes.js';
import repertoireRoutes from './routes/repertoireRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import presenceRoutes from './routes/presenceRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ----------------------------
// Middleware
// ----------------------------
app.use(express.json());
app.use(corsMiddleware);

// ----------------------------
// Routes
// ----------------------------
app.use("/api", routes);       
app.use("/api/auth", authRoutes); // auth routes (login/register)
app.use("/api/absences", absenceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/repertoire', repertoireRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/presence', presenceRoutes);


// ----------------------------
// Global Error Handler
// ----------------------------
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// ----------------------------
// Start Server
// ----------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
