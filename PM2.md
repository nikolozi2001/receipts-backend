# PM2 Process Manager Guide

This project is configured to run with PM2 process manager for production deployments.

## 📦 PM2 Configuration

The project includes an `ecosystem.config.json` file with two app configurations:

### 1. Single Instance (Development/Production)
- **Name**: `receipts-backend`
- **Mode**: Fork mode (single process)
- **Environments**: development, production, staging

### 2. Cluster Mode (High Performance)
- **Name**: `receipts-backend-cluster`
- **Mode**: Cluster mode (utilizes all CPU cores)
- **Environment**: production

## 🚀 PM2 Scripts

### Start the Application
```bash
# Start in production mode
npm run pm2:start

# Start in development mode
npm run pm2:dev

# Start in staging mode
npm run pm2:staging

# Start in cluster mode (all CPU cores)
npm run pm2:cluster
```

### Manage the Application
```bash
# Stop the application
npm run pm2:stop

# Restart the application
npm run pm2:restart

# Reload the application (zero downtime)
npm run pm2:reload

# Delete the application from PM2
npm run pm2:delete
```

### Monitor the Application
```bash
# View logs
npm run pm2:logs

# Monitor processes (interactive dashboard)
npm run pm2:monit

# Check status
npm run pm2:status

# Save current processes
npm run pm2:save

# Resurrect saved processes
npm run pm2:resurrect
```

## 📋 Direct PM2 Commands

If you prefer using PM2 directly:

```bash
# Start with ecosystem file
pm2 start ecosystem.config.json

# Start specific app
pm2 start ecosystem.config.json --only receipts-backend

# Start with environment
pm2 start ecosystem.config.json --env production

# View all processes
pm2 list

# View logs
pm2 logs receipts-backend

# Monitor
pm2 monit

# Stop all
pm2 stop all

# Restart all
pm2 restart all

# Delete all
pm2 delete all
```

## 🔧 Environment Variables

The PM2 configuration supports multiple environments:

- **Development**: `NODE_ENV=development`, `PORT=3001`
- **Production**: `NODE_ENV=production`, `PORT=3001`
- **Staging**: `NODE_ENV=staging`, `PORT=3002`

## 📊 Logging

Logs are stored in the `logs/` directory:
- `out.log` - Standard output
- `err.log` - Error logs
- `combined.log` - Combined logs

## 🔄 Auto-restart

PM2 is configured to:
- Restart on crashes
- Restart if memory usage exceeds 1GB
- Limit restarts to prevent crash loops
- Minimum uptime of 10 seconds before considering stable

## 🌐 Cluster Mode Benefits

When using cluster mode (`npm run pm2:cluster`):
- Utilizes all CPU cores
- Load balancing across processes
- Zero-downtime reloads
- Better performance for high traffic

## 🛠 Production Deployment

For production deployment:

1. **Install PM2 globally** (optional):
   ```bash
   npm install -g pm2
   ```

2. **Start the application**:
   ```bash
   npm run pm2:start
   ```

3. **Save the process list**:
   ```bash
   npm run pm2:save
   ```

4. **Setup startup script** (Linux/macOS):
   ```bash
   pm2 startup
   # Follow the instructions displayed
   ```

5. **For Windows, consider using PM2-Windows-Service**:
   ```bash
   npm install -g pm2-windows-service
   pm2-service-install
   ```

## 📈 Monitoring

PM2 provides built-in monitoring:
- CPU usage
- Memory usage
- Restart count
- Uptime
- Log streaming

Access monitoring with:
```bash
npm run pm2:monit
```

## 🔧 Configuration Customization

Edit `ecosystem.config.json` to customize:
- Instance count
- Memory limits
- Environment variables
- Log file locations
- Restart policies

## 🚨 Troubleshooting

### Check if PM2 is running:
```bash
npm run pm2:status
```

### View recent logs:
```bash
npm run pm2:logs --lines 50
```

### Restart if stuck:
```bash
npm run pm2:delete
npm run pm2:start
```

### Clear logs:
```bash
pm2 flush
```