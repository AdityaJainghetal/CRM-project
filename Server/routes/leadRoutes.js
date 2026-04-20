// const express = require("express");
// const router = express.Router();
// const multer = require("multer");

// // Middlewares
// const authorize = require("../middlewares/authorize");

// // Controllers
// const {
//   bulkUploadLeads,
//   uploadAttendance,
//   getAttendanceByDatequery,
//   getAttendanceByName,
// } = require("../controller/leadController");

// // Multer for leads (memory storage)
// const leadUpload = multer({ storage: multer.memoryStorage() });

// // Multer for attendance (disk storage)
// const upload = require("../middlewares/multer");

// // ===================== LEAD ROUTES =====================

// /**
//  * Bulk Upload Leads (Excel/CSV)
//  * Only Admin can upload leads
//  */
// router.post("/bulk-upload", leadUpload.single("file"), bulkUploadLeads);

// // ===================== ATTENDANCE ROUTES =====================

// /**
//  * Upload Attendance (Excel/CSV)
//  * Only Admin can upload attendance
//  */
// router.post(
//   "/upload-attendance",
//   upload.single("file"),

//   uploadAttendance,
// );

// /**
//  * Get Attendance by Date Range (with optional employee filter)
//  * Only Admin can access
//  */
// router.get(
//   "/attendance/datefilter",

//   getAttendanceByDatequery,
// );

// /**
//  * Get Attendance by Employee Name
//  * Accessible by Employee and HR
//  */
// router.get(
//   "/attendance/employee/:name",

//   getAttendanceByName,
// );

// module.exports = router;


const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  bulkUploadLeads,
  uploadAttendance,
  getAttendanceByDatequery,
  getAttendanceByName,
} = require("../controller/leadController");

// Memory storage for leads (buffer available in req.file.buffer)
const leadUpload = multer({ storage: multer.memoryStorage() });

// Disk storage for attendance (file saved to disk)
const diskUpload = require("../middlewares/multer");

// ===================== LEAD ROUTES =====================
router.post("/bulk-upload", leadUpload.single("file"), bulkUploadLeads);

// ===================== ATTENDANCE ROUTES =====================
router.post("/upload-attendance", diskUpload.single("file"), uploadAttendance);
router.get("/attendance/datefilter", getAttendanceByDatequery);
router.get("/attendance/employee/:name", getAttendanceByName);

module.exports = router;