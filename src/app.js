import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { API_CONFIG } from "./config/constants.js";
import apiRoutes from "./routes/api.js";
import { errorHandler, notFoundHandler } from "./utils/errorHandlers.js";

/**
 * Create and configure Express application
 * @returns {Object} Configured Express app
 */
export function createApp() {
  const app = express();

  // Middleware setup
  app.use(cors({
    origin: API_CONFIG.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
  }));
  
  // Additional headers for better cross-origin support
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "receipts-backend",
      client_ip: req.ip || req.connection.remoteAddress,
      headers: {
        host: req.get('host'),
        'user-agent': req.get('user-agent'),
        origin: req.get('origin')
      }
    });
  });

  // API routes
  app.use("/api", apiRoutes);

  // Error handling middleware
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}