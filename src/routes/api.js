import express from "express";
import { ReceiptController } from "../controllers/receiptController.js";

const router = express.Router();
const receiptController = new ReceiptController();

/**
 * POST /api/receipt-by-car
 * Search for receipts by car number using JSON body
 * 
 * @route POST /api/receipt-by-car
 * @body {string} carNumber - The car number to search for
 * @returns {Object} Search results from police.ge
 * 
 * @example
 * POST /api/receipt-by-car
 * Content-Type: application/json
 * {
 *   "carNumber": "GG599GF"
 * }
 */
router.post("/receipt-by-car", receiptController.searchReceiptsByCarPost.bind(receiptController));

/**
 * GET /api/receipt-by-car
 * Search for receipts by car number using query parameters
 * 
 * @route GET /api/receipt-by-car
 * @query {string} plate|carNumber - The car number to search for
 * @returns {Object} Search results from police.ge
 * 
 * @example
 * GET /api/receipt-by-car?plate=GG599GF
 * GET /api/receipt-by-car?carNumber=GG599GF
 */
router.get("/receipt-by-car", receiptController.searchReceiptsByCarGet.bind(receiptController));

/**
 * POST /api/receipt-by-person
 * Search for receipts by person details using JSON body
 * 
 * @route POST /api/receipt-by-person
 * @body {string} personalNo - The personal number to search for
 * @body {string} lastName - The last name to search for
 * @body {string} birthDate - The birth date in DD.MM.YYYY format
 * @returns {Object} Search results from police.ge
 * 
 * @example
 * POST /api/receipt-by-person
 * Content-Type: application/json
 * {
 *   "personalNo": "19001038117",
 *   "lastName": "ქაჩიბაია",
 *   "birthDate": "03.12.1977"
 * }
 */
router.post("/receipt-by-person", receiptController.searchReceiptsByPersonPost.bind(receiptController));

/**
 * GET /api/receipt-by-person
 * Search for receipts by person details using query parameters
 * 
 * @route GET /api/receipt-by-person
 * @query {string} personalNo - The personal number to search for
 * @query {string} lastName - The last name to search for
 * @query {string} birthDate - The birth date in DD.MM.YYYY format
 * @returns {Object} Search results from police.ge
 * 
 * @example
 * GET /api/receipt-by-person?personalNo=19001038117&lastName=ქაჩიბაია&birthDate=03.12.1977
 */
router.get("/receipt-by-person", receiptController.searchReceiptsByPersonGet.bind(receiptController));

export default router;