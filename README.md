# Receipts Backend API

A Node.js Express API that serves as a proxy to search for police protocol receipts by car number from the Georgian police database.

## Features

- 🔍 Search police protocols by car number
- 🌐 CORS enabled for cross-origin requests
- 🔒 Session management with CSRF token handling
- 📱 JSON response format
- 🏗️ Modular architecture with separation of concerns
- 🔧 Environment-based configuration
- 📊 Request logging and error handling
- 💚 Health check endpoint

## Project Structure

```
receipts-backend/
├── src/
│   ├── config/          # Configuration files
│   │   └── constants.js
│   ├── controllers/     # Request handlers
│   │   └── receiptController.js
│   ├── routes/         # API routes
│   │   └── api.js
│   ├── services/       # Business logic
│   │   └── policeService.js
│   ├── utils/          # Utility functions
│   │   └── errorHandlers.js
│   └── app.js          # Express app configuration
├── index.js            # Application entry point
├── package.json
├── .env.example        # Environment variables template
└── README.md
```

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd receipts-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env file with your configuration
```

## Usage

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /health
```
Returns the health status of the API.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2023-11-19T10:00:00.000Z",
  "service": "receipts-backend"
}
```

### Search Receipts - POST Method

```
POST /api/receipt-by-car
```

Search for police protocol receipts by car number using JSON body.

**Request Body:**
```json
{
  "carNumber": "ABC123"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    // Protocol data from police.ge
  ]
}
```

### Search Receipts - GET Method

```
GET /api/receipt-by-car?plate=ABC123
GET /api/receipt-by-car?carNumber=ABC123
```

Search for police protocol receipts using query parameters.

**Query Parameters:**
- `plate` or `carNumber` - The car number to search for

**Error Response:**
```json
{
  "error": "carNumber is required",
  "message": "Please provide a car number in the request body"
}
```

## Example Usage

### Using fetch API (POST)
```javascript
const response = await fetch('http://localhost:3001/api/receipt-by-car', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    carNumber: 'ABC123'
  })
});

const data = await response.json();
console.log(data);
```

### Using browser/curl (GET)
```bash
# Using curl
curl "http://localhost:3001/api/receipt-by-car?plate=ABC123"

# Or simply open in browser
http://localhost:3001/api/receipt-by-car?plate=ABC123
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `CORS_ORIGIN` | CORS allowed origins | `*` |

## Dependencies

- `express` - Web framework
- `node-fetch` - HTTP client
- `cors` - Cross-origin resource sharing
- `body-parser` - Request body parsing
- `cookie-parser` - Cookie parsing
- `cheerio` - HTML parsing
- `dotenv` - Environment variable loading

## Development Dependencies

- `nodemon` - Development server with auto-restart

## Architecture

This application follows a modular architecture with clear separation of concerns:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and external API interactions
- **Routes**: Define API endpoints and route handlers
- **Config**: Store configuration constants and settings
- **Utils**: Provide utility functions and middleware

## Error Handling

The application includes comprehensive error handling:
- Global error handler middleware
- 404 handler for unknown routes
- Async error handling wrapper
- Development vs production error responses

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request