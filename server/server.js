// ✅ Required dependencies
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const listEndpoints = require("express-list-endpoints");

// ✅ Import Routes
const geminiRoutes = require("./routes/geminiRoutes");

const app = express();

// ✅ Connect to MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB Connected..."))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// ✅ Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`✅ Created 'uploads' directory at ${uploadDir}`);
} else {
  console.log(`✅ 'uploads' directory exists at ${uploadDir}`);
}

// ✅ Middleware for security, compression, and JSON parsing
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "http://localhost:5000"],
        frameSrc: ["'self'"],
      },
    },
    crossOriginResourcePolicy: { policy: "same-origin" },
  })
);
app.use(compression());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Use Gemini Routes for AI-based Interview Question Generation
app.use("/api", geminiRoutes);

// ✅ Root Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "🚀 Server is running successfully!" });
});

// ✅ Handle Unknown Routes
app.use((req, res) => {
  console.error(`❌ Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

// ✅ Centralized Error Handling
app.use((err, req, res, next) => {
  console.error("❌ Internal Server Error:", err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

// ✅ Graceful Shutdown (Including DB Close)
process.on("SIGINT", async () => {
  console.log("\n🔴 Shutting down server...");
  server.close(async () => {
    console.log("✅ Server closed. Closing database connection...");
    await mongoose.connection.close();
    console.log("✅ Database connection closed. Exiting process...");
    process.exit(0);
  });
});
