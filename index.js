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
  
  const server = app.listen(API_CONFIG.PORT, () => {
    console.log(`🚀 Police Receipts API running on http://localhost:${API_CONFIG.PORT}`);
    console.log(`📋 Health check available at http://localhost:${API_CONFIG.PORT}/health`);
    console.log(`🔍 Search endpoint: http://localhost:${API_CONFIG.PORT}/api/receipt-by-car`);
    console.log(`📖 Environment: ${process.env.NODE_ENV || "development"}`);
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

// Start the server if this file is run directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  startServer();
}

export { startServer };