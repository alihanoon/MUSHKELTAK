import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import complaintRoutes from "./routes/complaintRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import lookupRoutes from "./routes/lookupRoutes";
import { fileURLToPath } from "url";
import os from 'os';
import logger from "./utils/logger";
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

dotenv.config();
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Routes
  app.use("/api/users", userRoutes);
  app.use("/api/complaints", complaintRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/lookups", lookupRoutes);

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // تسجيل الأخطاء الجسيمة فقط (500) وتجنب طباعة أخطاء المستخدمين (مثل 401 غير مصرح) في الكونسول
    if (statusCode >= 500) {
      logger.error(`Error: ${err.message} - URL: ${req.originalUrl} - Method: ${req.method} - IP: ${req.ip}`, { stack: err.stack });
    }
    
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  });

  // MongoDB Connection
  const MONGODB_URI = process.env.MONGODB_URI;
  if (MONGODB_URI) {
    mongoose
      .connect(MONGODB_URI, {
        dbName: 'mushkeltak', // تأكد من إضافة هذا السطر هنا
      })
      .then(async () => {
        logger.info("Connected to MongoDB");
        // Bootstrap initial admin
        const adminEmail = "Anas@test.com";
        const adminExists = await mongoose.model("User").findOne({ email: adminEmail });
        if (!adminExists) {
          await mongoose.model("User").create({
            name: "Anas obeidat",
            email: adminEmail,
            password: "Anas@123456",
            phone: "00962796378627",
            role: 1,
          });
          logger.info("Initial admin user created");
        }
      })
      .catch((err) => logger.error("MongoDB connection error: " + err.message));
  } else {
    logger.warn("MONGODB_URI not found in environment variables. Database features will not work.");
  }

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Mushkilatak API is running" });
  });
 
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }



  const getLocalExternalIP = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name]!) {
        // نبحث عن IPv4 ولا يكون الداخلي (127.0.0.1)
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
    return 'localhost';
  };

  const HOST = '0.0.0.0';
  const LAN_IP = getLocalExternalIP();
  app.listen(Number(PORT), HOST, () => {
    logger.info(`Server is up and running!`);
    console.log(`\x1b[32m%s\x1b[0m`, ` Server is up and running!`);
    console.log(`-----------------------------------------`);
    console.log(` Local:            http://localhost:${PORT}`);
    console.log(` On Your Network:   http://${LAN_IP}:${PORT}`);
    console.log(`-----------------------------------------`);
  });

  // app.listen(PORT, "0.0.0.0", () => {
  //   console.log(`Server running on http://localhost:${PORT}`);
  // });
}

startServer();
