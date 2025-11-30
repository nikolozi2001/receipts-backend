import dotenv from "dotenv";
import { createApp } from "./src/app.js";
import { API_CONFIG } from "./src/config/constants.js";

// Load environment variables
dotenv.config();

/**
 * Start the server
 */
function startServer() {
  const app = createApp();
  
  const server = app.listen(API_CONFIG.PORT, '0.0.0.0', () => {
    const address = server.address();
    console.log(`🚀 Police Receipts API running on http://0.0.0.0:${API_CONFIG.PORT}`);
    console.log(`🌐 Accessible from: http://192.168.3.3:${API_CONFIG.PORT}`);
    console.log(`📋 Health check available at http://192.168.3.3:${API_CONFIG.PORT}/health`);
    console.log(`🔍 Search endpoint: http://192.168.3.3:${API_CONFIG.PORT}/api/receipt-by-car`);
    console.log(`📖 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`📡 Server bound to: ${address.address}:${address.port}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    server.close(() => {
      console.log("Process terminated");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    console.log("\nSIGINT received. Shutting down gracefully...");
    server.close(() => {
      console.log("Process terminated");
      process.exit(0);
    });
  });
}

// Start the server
startServer();

export { startServer };