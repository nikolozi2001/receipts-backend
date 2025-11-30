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

  // Trust proxy for Windows server environments
  app.set('trust proxy', true);
  
  // Enhanced request logging for debugging connectivity
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
    const forwarded = req.get('X-Forwarded-For') || 'none';
    console.log(`[${timestamp}] ${req.method} ${req.path} - Client: ${clientIP} - Forwarded: ${forwarded} - Host: ${req.get('host')}`);
    next();
  });

  // Simplified and enhanced CORS configuration
  app.use((req, res, next) => {
    // Set CORS headers for all requests
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    next();
  });
  
  // Backup CORS middleware
  app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cache-Control']
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "receipts-backend",
      server_ip: "192.168.3.3",
      client_ip: req.ip || req.connection.remoteAddress,
      headers: {
        host: req.get('host'),
        'user-agent': req.get('user-agent'),
        origin: req.get('origin'),
        'x-forwarded-for': req.get('x-forwarded-for')
      },
      connection: {
        remoteAddress: req.connection?.remoteAddress,
        remotePort: req.connection?.remotePort,
        localAddress: req.connection?.localAddress,
        localPort: req.connection?.localPort
      }
    });
  });
  
  // Simple connectivity test endpoint
  app.get("/test", (req, res) => {
    res.send(`Server is accessible! Time: ${new Date().toISOString()}`);
  });
  
  // Network info endpoint
  app.get("/network-info", (req, res) => {
    res.json({
      message: "Network connectivity test",
      server: {
        host: req.get('host'),
        protocol: req.protocol,
        secure: req.secure,
        ip: req.ip,
        ips: req.ips
      },
      client: {
        ip: req.connection?.remoteAddress,
        port: req.connection?.remotePort,
        userAgent: req.get('user-agent')
      },
      timestamp: new Date().toISOString()
    });
  });

  // API routes
  app.use("/api", apiRoutes);

  // Error handling middleware
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}