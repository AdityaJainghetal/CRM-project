// const XLSX = require("xlsx");
// const Lead = require("../models/lead/LeadModel");
// const LeadModel = require("../models/lead/LeadModel");
// const fs = require("fs");
// const upload = require("../middlewares/multer");


// const normalizeKey = (key) => {
//   if (!key) return "";
//   const k = String(key).trim().toLowerCase();

//   if (
//     k.includes("name") &&
//     !k.includes("parent") &&
//     !k.includes("father") &&
//     !k.includes("mother")
//   ) {
//     return "name";
//   }
//   if (
//     k.includes("phone") ||
//     k.includes("mobile") ||
//     k.includes("number") ||
//     k.includes("contact")
//   ) {
//     return "phone";
//   }
//   if (k.includes("parent") || k.includes("father") || k.includes("mother")) {
//     return "parentName";
//   }
//   if (k.includes("city") || k.includes("location") || k.includes("district")) {
//     return "city";
//   }
//   if (k.includes("email")) return "email";
//   if (k.includes("neet")) return "neetStatus";
//   if (k.includes("budget")) return "budget";
//   if (k.includes("country") || k.includes("prefer")) return "preferredCountry";
//   if (k.includes("college")) return "collegeName";
//   if (k.includes("emergency")) return "emergencyContact";
//   if (k.includes("service") && k.includes("manager")) return "serviceManager";

//   return k.replace(/\s+/g, "");
// };

// const cleanString = (value) => {
//   if (value === null || value === undefined) return "";
//   return String(value).trim();
// };

// const parseWorkbook = (buffer, extension) => {
//   const workbook =
//     extension === "csv"
//       ? XLSX.read(buffer.toString("utf8"), { type: "string" })
//       : XLSX.read(buffer, { type: "buffer" });

//   const sheetName = workbook.SheetNames[0];
//   if (!sheetName) return [];
//   const worksheet = workbook.Sheets[sheetName];
//   return XLSX.utils.sheet_to_json(worksheet, { defval: "" });
// };



// exports.bulkUploadLeads = async (req, res) => {
//   try {
//     if (!req.file || !req.file.buffer) {
//       return res.status(400).json({
//         success: false,
//         message: "No file uploaded or buffer missing.",
//       });
//     }

//     const extension = req.file.originalname.split(".").pop().toLowerCase();

//     if (!["csv", "xlsx", "xls"].includes(extension)) {
//       return res.status(400).json({
//         success: false,
//         message: "Only .csv, .xlsx, .xls files are allowed.",
//       });
//     }

//     // Parse the file
//     const rows = parseWorkbook(req.file.buffer, extension);

//     if (!rows || rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Uploaded file is empty.",
//       });
//     }

//     const leadsToInsert = rows
//       .map((row) => {
//         const normalized = {};
//         Object.keys(row).forEach((key) => {
//           normalized[normalizeKey(key)] = row[key];
//         });

//         const rawPhone = cleanString(normalized.phone || normalized.phonenumber || "");
//         let cleanedPhone = rawPhone.replace(/\D/g, ""); // only digits

//         // Remove country code 91 if present
//         if (cleanedPhone.startsWith("91") && cleanedPhone.length > 10) {
//           cleanedPhone = cleanedPhone.slice(2);
//         }

//         const budgetValue = normalized.budget || normalized.budgetinr;
//         const budgetNumber = budgetValue
//           ? Number(String(budgetValue).replace(/,/g, "").trim())
//           : undefined;

//         return {
//           name: cleanString(normalized.name),
//           phone: cleanedPhone,
//           parentName: cleanString(normalized.parentname || normalized.parentsname),
//           city: cleanString(normalized.city),
//           email: cleanString(normalized.email),
//           neetStatus: cleanString(normalized.neetstatus),
//           budget: Number.isFinite(budgetNumber) ? budgetNumber : undefined,
//           preferredCountry: cleanString(normalized.preferredcountry),
//           collegeName: cleanString(normalized.collegename),
//           emergencyContact: cleanString(normalized.emergencycontact),
//           serviceManager: cleanString(normalized.servicemanager),
//           status: "New",
//           leadTag: "Warm",           // ← Hardcoded (safe)
//         };
//       })
//       .filter((lead) => lead.name && lead.phone && lead.phone.length >= 10);

//     if (leadsToInsert.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No valid leads found. Each row must have Name and valid Phone.",
//       });
//     }

//     const inserted = await Lead.insertMany(leadsToInsert, { ordered: false });

//     return res.status(201).json({
//       success: true,
//       message: `Successfully imported ${inserted.length} leads!`,
//       totalRows: rows.length,
//       imported: inserted.length,
//       skipped: rows.length - inserted.length,
//     });

//   } catch (error) {
//     console.error("Bulk Upload Error:", error);

//     if (error.name === "ValidationError") {
//       return res.status(400).json({
//         success: false,
//         message: "Validation failed for some leads.",
//         error: error.message,
//       });
//     }

//     if (error.code === 11000) {
//       return res.status(409).json({
//         success: false,
//         message: "Some leads were skipped due to duplicates (phone already exists).",
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error during bulk upload.",
//       error: error.message,
//     });
//   }
// };

// // ====================== Upload Attendance ======================
// exports.uploadAttendance = async (req, res) => {
//   try {
//     if (!req.file || !req.file.buffer) {
//       return res.status(400).json({
//         success: false,
//         message: "No file uploaded. Please upload an Excel or CSV file.",
//       });
//     }

//     const extension = String(req.file.originalname)
//       .split(".")
//       .pop()
//       .toLowerCase();

//     if (!["csv", "xlsx", "xls"].includes(extension)) {
//       return res.status(400).json({
//         success: false,
//         message: "Unsupported file type. Please upload .xlsx, .xls, or .csv.",
//       });
//     }

//     // TODO: Add your Attendance Model and logic here
//     // For now, returning placeholder response
//     const rows = parseWorkbook(req.file.buffer, extension);

//     return res.status(200).json({
//       success: true,
//       message: "Attendance upload feature is under development.",
//       totalRows: rows.length,
//       note: "Please implement Attendance model and logic in uploadAttendance function",
//     });
//   } catch (error) {
//     console.error("Upload Attendance Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error while uploading attendance.",
//       error: error.message,
//     });
//   }
// };

// // ====================== Get Attendance by Date Query ======================
// exports.getAttendanceByDatequery = async (req, res) => {
//   try {
//     const { fromDate, toDate, employeeName } = req.query;

//     // TODO: Replace with your actual Attendance Model when ready
//     // For now returning placeholder

//     return res.status(200).json({
//       success: true,
//       message: "Attendance date filter endpoint is ready (placeholder).",
//       queryParams: { fromDate, toDate, employeeName },
//       note: "Implement actual attendance query logic here",
//     });
//   } catch (error) {
//     console.error("Get Attendance By Date Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching attendance data.",
//       error: error.message,
//     });
//   }
// };

// // ====================== Get Attendance by Name (from your old code) ======================
// exports.getAttendanceByName = async (req, res) => {
//   try {
//     const { name } = req.params;

//     if (!name) {
//       return res.status(400).json({
//         success: false,
//         message: "Employee name is required",
//       });
//     }

//     // TODO: Implement with your Attendance Model
//     return res.status(200).json({
//       success: true,
//       message: `Attendance records for ${name}`,
//       note: "Implement actual attendance lookup logic here",
//     });
//   } catch (error) {
//     console.error("Get Attendance By Name Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching attendance by name.",
//       error: error.message,
//     });
//   }
// };


const XLSX = require("xlsx");
const Lead = require("../models/lead/LeadModel");

const normalizeKey = (key) => {
  if (!key) return "";
  const k = String(key).trim().toLowerCase();

  if (
    k.includes("name") &&
    !k.includes("parent") &&
    !k.includes("father") &&
    !k.includes("mother")
  ) {
    return "name";
  }
  if (
    k.includes("phone") ||
    k.includes("mobile") ||
    k.includes("number") ||
    k.includes("contact")
  ) {
    return "phone";
  }
  if (k.includes("parent") || k.includes("father") || k.includes("mother")) {
    return "parentName";
  }
  if (k.includes("city") || k.includes("location") || k.includes("district")) {
    return "city";
  }
  if (k.includes("email")) return "email";
  if (k.includes("neet")) return "neetStatus";
  if (k.includes("budget")) return "budget";
  if (k.includes("country") || k.includes("prefer")) return "preferredCountry";
  if (k.includes("college")) return "collegeName";
  if (k.includes("emergency")) return "emergencyContact";
  if (k.includes("service") && k.includes("manager")) return "serviceManager";

  return k.replace(/\s+/g, "");
};

const cleanString = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const parseWorkbook = (buffer, extension) => {
  const workbook =
    extension === "csv"
      ? XLSX.read(buffer.toString("utf8"), { type: "string" })
      : XLSX.read(buffer, { type: "buffer" });

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet, { defval: "" });
};

// ====================== Bulk Upload Leads ======================
exports.bulkUploadLeads = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded or buffer missing.",
      });
    }

    const extension = req.file.originalname.split(".").pop().toLowerCase();

    if (!["csv", "xlsx", "xls"].includes(extension)) {
      return res.status(400).json({
        success: false,
        message: "Only .csv, .xlsx, .xls files are allowed.",
      });
    }

    const rows = parseWorkbook(req.file.buffer, extension);

    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Uploaded file is empty.",
      });
    }

    const leadsToInsert = rows
      .map((row) => {
        const normalized = {};
        Object.keys(row).forEach((key) => {
          const nk = normalizeKey(key);
          normalized[nk] = row[key];
        });

        const rawPhone = cleanString(normalized.phone || "");
        let cleanedPhone = rawPhone.replace(/\D/g, ""); // digits only

        // Remove country code 91 if present
        if (cleanedPhone.startsWith("91") && cleanedPhone.length > 10) {
          cleanedPhone = cleanedPhone.slice(2);
        }

        const budgetRaw = normalized.budget;
        const budgetNumber = budgetRaw
          ? Number(String(budgetRaw).replace(/,/g, "").trim())
          : undefined;

        return {
          name: cleanString(normalized.name),
          phone: cleanedPhone,
          parentName: cleanString(normalized.parentName || ""),
          city: cleanString(normalized.city || ""),
          email: cleanString(normalized.email || ""),
          neetStatus: cleanString(normalized.neetStatus || ""),
          budget: Number.isFinite(budgetNumber) ? budgetNumber : undefined,
          preferredCountry: cleanString(normalized.preferredCountry || ""),
          collegeName: cleanString(normalized.collegeName || ""),
          emergencyContact: cleanString(normalized.emergencyContact || ""),
          serviceManager: cleanString(normalized.serviceManager || ""),
          status: "New",
          leadTag: "Warm",
        };
      })
      .filter((lead) => lead.name && lead.phone && lead.phone.length >= 10);

    if (leadsToInsert.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid leads found. Each row must have Name and valid Phone (10+ digits).",
      });
    }

    let inserted = [];
    let skippedCount = 0;

    try {
      inserted = await Lead.insertMany(leadsToInsert, { ordered: false });
    } catch (bulkError) {
      // ordered: false means it continues on duplicate errors
      if (bulkError.insertedDocs) {
        inserted = bulkError.insertedDocs;
      } else if (bulkError.result && bulkError.result.insertedCount !== undefined) {
        skippedCount = leadsToInsert.length - bulkError.result.insertedCount;
        inserted = { length: bulkError.result.insertedCount };
      } else if (bulkError.code !== 11000) {
        throw bulkError; // re-throw non-duplicate errors
      }
    }

    return res.status(201).json({
      success: true,
      message: `Successfully imported ${inserted.length} leads!`,
      totalRows: rows.length,
      imported: inserted.length,
      skipped: rows.length - (inserted.length || 0),
    });
  } catch (error) {
    console.error("Bulk Upload Error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed for some leads.",
        error: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Some or all leads were skipped — phone numbers already exist.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error during bulk upload.",
      error: error.message,
    });
  }
};

// ====================== Upload Attendance ======================
exports.uploadAttendance = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please upload an Excel or CSV file.",
      });
    }

    const extension = String(req.file.originalname).split(".").pop().toLowerCase();

    if (!["csv", "xlsx", "xls"].includes(extension)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type. Please upload .xlsx, .xls, or .csv.",
      });
    }

    // Read from disk path (disk storage multer)
    const fs = require("fs");
    const buffer = fs.readFileSync(req.file.path);
    const rows = parseWorkbook(buffer, extension);

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    return res.status(200).json({
      success: true,
      message: "Attendance upload feature is under development.",
      totalRows: rows.length,
    });
  } catch (error) {
    console.error("Upload Attendance Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while uploading attendance.",
      error: error.message,
    });
  }
};

// ====================== Get Attendance by Date Query ======================
exports.getAttendanceByDatequery = async (req, res) => {
  try {
    const { fromDate, toDate, employeeName } = req.query;

    return res.status(200).json({
      success: true,
      message: "Attendance date filter endpoint is ready.",
      queryParams: { fromDate, toDate, employeeName },
    });
  } catch (error) {
    console.error("Get Attendance By Date Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching attendance data.",
      error: error.message,
    });
  }
};

// ====================== Get Attendance by Name ======================
exports.getAttendanceByName = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Employee name is required",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Attendance records for ${name}`,
    });
  } catch (error) {
    console.error("Get Attendance By Name Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching attendance by name.",
      error: error.message,
    });
  }
};