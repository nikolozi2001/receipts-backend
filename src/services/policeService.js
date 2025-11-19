import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { POLICE_ENDPOINTS, DEFAULT_HEADERS } from "../config/constants.js";

/**
 * Service for interacting with police.ge API
 */
export class PoliceService {
  /**
   * Create a session with police.ge and get CSRF token
   * @returns {Object} Session data including cookie and CSRF token
   */
  async createSession() {
    try {
      const response = await fetch(POLICE_ENDPOINTS.BASE, {
        headers: {
          ...DEFAULT_HEADERS,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
        }
      });

      const cookie = response.headers.get("set-cookie");
      const html = await response.text();
      
      console.log("Session Response Status:", response.status);
      console.log("Session Cookie:", cookie);

      const $ = cheerio.load(html);
      const csrf = $('input[name="csrf_token"]').val() || "";
      
      console.log("CSRF Token:", csrf);
      
      return { cookie, csrf };
    } catch (error) {
      console.error("Error creating session:", error);
      throw new Error("Failed to create session with police.ge");
    }
  }

  /**
   * Search for protocols by car number
   * @param {string} carNumber - The car number to search for
   * @returns {Object} Search results from police.ge
   */
  async searchByCarNumber(carNumber) {
    try {
      const { cookie, csrf } = await this.createSession();

      const form = new URLSearchParams();
      form.append("firstResult", "0");
      form.append("protocolAuto", carNumber.toUpperCase());

      // Add CSRF token if it exists
      if (csrf) {
        form.append("csrf_token", csrf);
      }

      console.log("Search Request Body:", form.toString());

      const response = await fetch(POLICE_ENDPOINTS.SEARCH_BY_AUTO, {
        method: "POST",
        headers: {
          Cookie: cookie,
          ...DEFAULT_HEADERS,
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Referer: "https://police.ge/protocol/index.php#",
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json, text/javascript, */*; q=0.01"
        },
        body: form.toString()
      });

      const text = await response.text();
      
      console.log("Search Response Status:", response.status);
      console.log("Search Response Text:", text.substring(0, 500));

      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.log("JSON Parse Error:", parseError.message);
        return { success: false, html: text };
      }
    } catch (error) {
      console.error("Error searching by car number:", error);
      throw new Error("Failed to search protocols");
    }
  }
}