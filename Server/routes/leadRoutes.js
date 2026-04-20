const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  bulkUploadLeads,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  addLead,
} = require("../controller/leadController");

const leadUpload = multer({ storage: multer.memoryStorage() });
const diskUpload = require("../middlewares/multer");

// ===================== LEAD ROUTES =====================
router.post("/bulk-upload", leadUpload.single("file"), bulkUploadLeads);
router.get("/", getAllLeads);
router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);
router.post("/add", addLead);

module.exports = router;
