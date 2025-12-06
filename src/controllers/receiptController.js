import { PoliceService } from "../services/policeService.js";

const policeService = new PoliceService();

/**
 * Controller for receipt-related operations
 */
export class ReceiptController {
  /**
   * Search for receipts by car number (POST method)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchReceiptsByCarPost(req, res) {
    try {
      const { carNumber } = req.body;

      if (!carNumber) {
        return res.status(400).json({ 
          error: "carNumber is required",
          message: "Please provide a car number in the request body"
        });
      }

      const result = await policeService.searchByCarNumber(carNumber);
      res.json(result);
    } catch (error) {
      console.error("Server error in POST /api/receipt-by-car:", error);
      res.status(500).json({ 
        error: "Internal server error",
        message: "Failed to process the request"
      });
    }
  }

  /**
   * Search for receipts by car number (GET method)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchReceiptsByCarGet(req, res) {
    try {
      const { plate, carNumber } = req.query;
      const searchParam = plate || carNumber;

      if (!searchParam) {
        return res.status(400).json({ 
          error: "Car number parameter is required",
          message: "Please provide either 'plate' or 'carNumber' as a query parameter"
        });
      }

      const result = await policeService.searchByCarNumber(searchParam);
      res.json(result);
    } catch (error) {
      console.error("Server error in GET /api/receipt-by-car:", error);
      res.status(500).json({ 
        error: "Internal server error",
        message: "Failed to process the request"
      });
    }
  }

  /**
   * Search for receipts by person details (POST method)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchReceiptsByPersonPost(req, res) {
    try {
      const { personalNo, lastName, birthDate } = req.body;

      if (!personalNo || !lastName || !birthDate) {
        return res.status(400).json({ 
          error: "Missing required parameters",
          message: "Please provide personalNo, lastName, and birthDate in the request body"
        });
      }

      const result = await policeService.searchByPerson(personalNo, lastName, birthDate);
      res.json(result);
    } catch (error) {
      console.error("Server error in POST /api/receipt-by-person:", error);
      res.status(500).json({ 
        error: "Internal server error",
        message: "Failed to process the request"
      });
    }
  }

  /**
   * Search for receipts by person details (GET method)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchReceiptsByPersonGet(req, res) {
    try {
      const { personalNo, lastName, birthDate } = req.query;

      if (!personalNo || !lastName || !birthDate) {
        return res.status(400).json({ 
          error: "Missing required parameters",
          message: "Please provide personalNo, lastName, and birthDate as query parameters"
        });
      }

      const result = await policeService.searchByPerson(personalNo, lastName, birthDate);
      res.json(result);
    } catch (error) {
      console.error("Server error in GET /api/receipt-by-person:", error);
      res.status(500).json({ 
        error: "Internal server error",
        message: "Failed to process the request"
      });
    }
  }
}