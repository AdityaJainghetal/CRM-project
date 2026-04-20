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

// ====================== Add Single Lead ======================
exports.addLead = async (req, res) => {
  try {
    const {
      name, phone, parentName, city, email,
      neetStatus, budget, preferredCountry,
      collegeName, emergencyContact, status, leadTag,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: "Name and Phone are required." });
    }

    let cleanedPhone = String(phone).replace(/\D/g, "");
    if (cleanedPhone.startsWith("91") && cleanedPhone.length > 10) {
      cleanedPhone = cleanedPhone.slice(2);
    }

    if (cleanedPhone.length < 10) {
      return res.status(400).json({ success: false, message: "Invalid phone number." });
    }

    const lead = await Lead.create({
      name: String(name).trim(),
      phone: cleanedPhone,
      parentName, city, email, neetStatus,
      budget: budget ? Number(String(budget).replace(/,/g, "")) : undefined,
      preferredCountry, collegeName, emergencyContact,
      status: status || "New",
      leadTag: leadTag || "Warm",
    });

    return res.status(201).json({ success: true, message: "Lead added successfully.", data: lead });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Phone number already exists." });
    }
    return res.status(500).json({ success: false, message: "Error adding lead.", error: error.message });
  }
};



// ====================== Get Attendance by Name ======================


exports.getAllLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search = "",
      status,
      leadTag,
      city,
    } = req.query;

    const filter = {};

    // Search by name, phone or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status) filter.status = status;
    if (leadTag) filter.leadTag = leadTag;
    if (city) filter.city = { $regex: city, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("assignedToTelecaller", "name email")
        .populate("assignedToCounsellor", "name email")
        .lean(),                    // Important: Returns plain JavaScript objects with full data

      Lead.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: leads,
    });
  } catch (error) {
    console.error("Get All Leads Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching leads.",
      error: error.message,
    });
  }
};
// exports.getAllLeads = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       search = "",
//       status,
//       leadTag,
//       city,
//     } = req.query;

//     const filter = {};

//     // Search by name or phone
//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { phone: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//       ];
//     }

//     if (status) filter.status = status;
//     if (leadTag) filter.leadTag = leadTag;
//     if (city) filter.city = { $regex: city, $options: "i" };

//     const skip = (Number(page) - 1) * Number(limit);

//     const [leads, total] = await Promise.all([
//       Lead.find(filter)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(Number(limit))
//         .populate("assignedToTelecaller", "name email")
//         .populate("assignedToCounsellor", "name email"),
//       Lead.countDocuments(filter),
//     ]);

//     return res.status(200).json({
//       success: true,
//       total,
//       page: Number(page),
//       totalPages: Math.ceil(total / Number(limit)),
//       data: leads,
//     });
//   } catch (error) {
//     console.error("Get All Leads Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching leads.",
//       error: error.message,
//     });
//   }
// };

// ====================== Get Single Lead ======================
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("assignedToTelecaller", "name email")
      .populate("assignedToCounsellor", "name email");

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error("Get Lead By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching lead.",
      error: error.message,
    });
  }
};

// ====================== Update Lead ======================
exports.updateLead = async (req, res) => {
  try {
    const allowedFields = [
      "name", "phone", "parentName", "city", "email",
      "neetStatus", "budget", "preferredCountry", "collegeName",
      "emergencyContact", "serviceManager", "status", "leadTag",
      "followUpDate", "registrationFeePaid", "documentsSubmitted",
      "admissionLetterIssued", "visaApplied", "visaIssued",
      "ticketBooked", "departureDate", "departureStatus",
      "assignedToTelecaller", "assignedToCounsellor",
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    updateData.updatedAt = new Date();

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully.",
      data: lead,
    });
  } catch (error) {
    console.error("Update Lead Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists for another lead.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error updating lead.",
      error: error.message,
    });
  }
};

// ====================== Delete Lead ======================
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Lead Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting lead.",
      error: error.message,
    });
  }
};