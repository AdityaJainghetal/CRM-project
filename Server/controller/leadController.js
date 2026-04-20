const XLSX = require("xlsx");
const Lead = require("../models/lead/LeadModel");
const LeadModel = require("../models/lead/LeadModel");

// ====================== Helper Functions ======================

const normalizeKey = (key) => {
  if (!key) return "";
  const k = String(key).trim().toLowerCase();

  if (k.includes("name") && !k.includes("parent") && !k.includes("father") && !k.includes("mother")) {
    return "name";
  }
  if (k.includes("phone") || k.includes("mobile") || k.includes("number") || k.includes("contact")) {
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
// exports.bulkUploadLeads = async (req, res) => {
//   try {
//     if (!req.file || !req.file.buffer) {
//       return res.status(400).json({
//         success: false,
//         message: "No file uploaded. Please upload an Excel or CSV file.",
//       });
//     }

//     const extension = String(req.file.originalname).split(".").pop().toLowerCase();

//     if (!["csv", "xlsx", "xls"].includes(extension)) {
//       return res.status(400).json({
//         success: false,
//         message: "Unsupported file type. Please upload .xlsx, .xls, or .csv.",
//       });
//     }

//     const rows = parseWorkbook(req.file.buffer, extension);

//     if (!rows || rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "The uploaded file is empty or contains no usable data.",
//       });
//     }

//     const leadsToInsert = rows
//       .map((row) => {
//         const normalized = {};
//         Object.keys(row).forEach((key) => {
//           normalized[normalizeKey(key)] = row[key];
//         });

//         const rawPhone = cleanString(normalized.phone);
//         const cleanedPhone = rawPhone.replace(/\.0+$/, "");

//         const budgetValue = normalized.budget;
//         const budgetNumber =
//           budgetValue === "" || budgetValue === null || budgetValue === undefined
//             ? undefined
//             : Number(String(budgetValue).replace(/,/g, ""));

//         return {
//           name: cleanString(normalized.name),
//           phone: cleanedPhone,
//           parentName: cleanString(normalized.parentName),
//           city: cleanString(normalized.city),
//           email: cleanString(normalized.email),
//           neetStatus: cleanString(normalized.neetStatus),
//           budget: Number.isFinite(budgetNumber) ? budgetNumber : undefined,
//           preferredCountry: cleanString(normalized.preferredCountry),
//           collegeName: cleanString(normalized.collegeName),
//           emergencyContact: cleanString(normalized.emergencyContact),
//           serviceManager: cleanString(normalized.serviceManager),
//           status: "New",
//           leadTag: "Warm",
//         };
//       })
//       .filter((lead) => lead.name && lead.phone); // Must have name and phone

//     if (leadsToInsert.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No valid student records found. Each row must include at least 'Name' and 'Phone'.",
//       });
//     }

//     const inserted = await Lead.insertMany(leadsToInsert, { ordered: false });

//     return res.status(201).json({
//       success: true,
//       message: `Successfully imported ${inserted.length} students/leads!`,
//       totalRows: rows.length,
//       imported: inserted.length,
//       skipped: rows.length - inserted.length,
//     });
//   } catch (error) {
//     console.error("Bulk Upload Error:", error);

//     if (error.code === 11000 || error.name === "BulkWriteError") {
//       const insertedCount = Array.isArray(error.insertedDocs) ? error.insertedDocs.length : 0;
//       return res.status(409).json({
//         success: false,
//         message: `Upload partially succeeded. ${insertedCount} students imported; duplicate rows were skipped.`,
//         imported: insertedCount,
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error while saving students.",
//       error: error.message,
//     });
//   }
// };

exports.bulkUploadLeads = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an Excel file",
      });
    }

    // const employeeId = req.body.employeeId;

    // if (!employeeId) {
    //   fs.unlinkSync(req.file.path);
    //   return res.status(400).json({
    //     success: false,
    //     message: "Employee ID is required",
    //   });
    // }

    // const employee = await Employee.findById(employeeId);
    // if (!employee) {
    //   fs.unlinkSync(req.file.path);
    //   return res.status(404).json({
    //     success: false,
    //     message: "Employee not found",
    //   });
    // }

    // ================= READ EXCEL =================
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    let processed = 0;
    let skipped = 0;

    for (const row of data) {
      try {
        const name = row["Name"]?.trim();
        const phone = row["Phone Number"]?.toString().trim();

        if (!name || !phone) {
          skipped++;
          continue;
        }

        await LeadModel.create({
          name,
          phone,
          parentName: row["Parent's Name"] || "",
          city: row["City"] || "",
          email: row["Email"] || "",
          neetStatus: row["NEET Status"] || "",
          budget: row["Budget"] || "",
          preferredCountry: row["Preferred Country"] || "",
          assignedTo: employee._id,
        });

        processed++;
      } catch (err) {
        console.log("Row error:", err.message);
        skipped++;
      }
    }

    fs.unlinkSync(req.file.path);

    return res.status(200).json({
      success: true,
      message: "Leads uploaded successfully",
      total: data.length,
      processed,
      skipped,
    });
  } catch (error) {
    console.error(error);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ====================== Upload Attendance ======================
exports.uploadAttendance = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
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

    // TODO: Add your Attendance Model and logic here
    // For now, returning placeholder response
    const rows = parseWorkbook(req.file.buffer, extension);

    return res.status(200).json({
      success: true,
      message: "Attendance upload feature is under development.",
      totalRows: rows.length,
      note: "Please implement Attendance model and logic in uploadAttendance function",
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

    // TODO: Replace with your actual Attendance Model when ready
    // For now returning placeholder

    return res.status(200).json({
      success: true,
      message: "Attendance date filter endpoint is ready (placeholder).",
      queryParams: { fromDate, toDate, employeeName },
      note: "Implement actual attendance query logic here",
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

// ====================== Get Attendance by Name (from your old code) ======================
exports.getAttendanceByName = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Employee name is required",
      });
    }

    // TODO: Implement with your Attendance Model
    return res.status(200).json({
      success: true,
      message: `Attendance records for ${name}`,
      note: "Implement actual attendance lookup logic here",
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