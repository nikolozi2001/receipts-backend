// API Configuration
export const API_CONFIG = {
  PORT: process.env.PORT || 3001,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*"
};

// Police API endpoints
export const POLICE_ENDPOINTS = {
  BASE: "https://police.ge/protocol/index.php",
  SEARCH_BY_AUTO: "https://police.ge/protocol/index.php?url=protocols/searchByAuto"
};

// HTTP Headers for police.ge requests
export const DEFAULT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.5"
};