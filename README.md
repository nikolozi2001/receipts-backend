# Receipts Backend API

A Node.js Express API that serves as a proxy to search for police protocol receipts by car number from the Georgian police database.

## Features

- Search police protocols by car number
- CORS enabled for cross-origin requests
- Session management with CSRF token handling
- JSON response format

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

## Usage

1. Start the server:
```bash
npm start
```

2. The API will be available at `http://localhost:3001`

## API Endpoints

### POST `/api/receipt-by-car`

Search for police protocol receipts by car number.

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

**Error Response:**
```json
{
  "error": "carNumber is required"
}
```

## Example Usage

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

## Dependencies

- `express` - Web framework
- `node-fetch` - HTTP client
- `cors` - Cross-origin resource sharing
- `body-parser` - Request body parsing
- `cookie-parser` - Cookie parsing
- `cheerio` - HTML parsing

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request