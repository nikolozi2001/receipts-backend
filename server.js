import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as cheerio from "cheerio";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Police endpoints
const POLICE_BASE = "https://police.ge/protocol/index.php";
const SEARCH_BY_AUTO = "https://police.ge/protocol/index.php?url=protocols/searchByAuto";

/**
 * STEP 1 — Load main page → get PHPSESSID + CSRF token
 */
async function createSession() {
  const res = await fetch(POLICE_BASE, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
  });

  const cookie = res.headers.get("set-cookie");
  const html = await res.text();

  console.log("Session Response Status:", res.status);
  console.log("Session Cookie:", cookie);

  const $ = cheerio.load(html);
  const csrf = $('input[name="csrf_token"]').val() || "";

  console.log("CSRF Token:", csrf);
  
  return { cookie, csrf };
}

/**
 * STEP 2 — Use session and CSRF to call search endpoint
 */
async function searchByAuto(carNumber) {
  const { cookie, csrf } = await createSession();

  const form = new URLSearchParams();
  form.append("firstResult", "0");
  form.append("protocolAuto", carNumber.toUpperCase());

  // add CSRF only if exists
  if (csrf) form.append("csrf_token", csrf);

  console.log("Search Request Body:", form.toString());

  const res = await fetch(SEARCH_BY_AUTO, {
    method: "POST",
    headers: {
      Cookie: cookie,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Referer: "https://police.ge/protocol/index.php#",
      "X-Requested-With": "XMLHttpRequest",
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "Accept-Language": "en-US,en;q=0.5",
    },
    body: form.toString(),
  });

  const text = await res.text();
  
  console.log("Search Response Status:", res.status);
  console.log("Search Response Text:", text.substring(0, 500));

  try {
    return JSON.parse(text);
  } catch (e) {
    console.log("JSON Parse Error:", e.message);
    return { success: false, html: text };
  }
}

/**
 * PUBLIC API ROUTES
 */

// POST endpoint (for programmatic use with JSON body)
app.post("/api/receipt-by-car", async (req, res) => {
  const { carNumber } = req.body;

  if (!carNumber) {
    return res.status(400).json({ error: "carNumber is required" });
  }

  try {
    const result = await searchByAuto(carNumber);
    res.json(result);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET endpoint (for easy browser testing with query params)
app.get("/api/receipt-by-car", async (req, res) => {
  const { plate } = req.query;

  if (!plate) {
    return res.status(400).json({ error: "plate query parameter is required" });
  }

  try {
    const result = await searchByAuto(plate);
    res.json(result);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(3001, () => {
  console.log("Police Proxy API running on http://localhost:3001");
});
