
const XLSX = require('xlsx');
const Lead = require('../models/lead/LeadModel');
const fs = require('fs');

// Flexible Column Name Normalizer (Frontend ke saath perfectly match)
const normalizeKey = (key) => {
  if (!key) return '';
  
  const k = key.toString().toLowerCase().trim();

  if (k.includes("name") && !k.includes("parent") && !k.includes("father") && !k.includes("mother")) 
    return "name";

  if (k.includes("phone") || k.includes("mobile") || k.includes("number") || k.includes("contact")) 
    return "phone";

  if (k.includes("parent") || k.includes("father") || k.includes("mother")) 
    return "parentName";

  if (k.includes("city") || k.includes("location") || k.includes("district")) 
    return "city";

  if (k.includes("email")) return "email";
  if (k.includes("neet")) return "neetStatus";
  if (k.includes("budget")) return "budget";
  if (k.includes("country") || k.includes("prefer")) return "preferredCountry";

  return k.replace(/\s+/g, ''); // fallback
};

exports.bulkUploadLeads = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please upload an Excel or CSV file.",
      });
    }

    // Support both .xlsx and .csv
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    let jsonData = [];

    if (fileExtension === 'csv') {
      // CSV handling (agar future mein chahiye to yahan papaparse ya csv-parser use kar sakte hain)
      return res.status(400).json({
        success: false,
        message: "CSV support coming soon. Please upload .xlsx or .xls file for now.",
      });
    } 
    else {
      // Excel (.xlsx / .xls)
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      jsonData = XLSX.utils.sheet_to_json(worksheet);
    }

    if (!jsonData || jsonData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "The uploaded file is empty or contains no data.",
      });
    }

    const leadsToInsert = jsonData.map((row) => {
      const normalized = {};

      // Normalize all column keys
      Object.keys(row).forEach((key) => {
        const normKey = normalizeKey(key);
        normalized[normKey] = row[key];
      });

      return {
        name: String(normalized.name || "").trim(),
        phone: String(normalized.phone || "").trim(),
        parentName: String(normalized.parentName || "").trim(),
        city: String(normalized.city || "").trim(),
        email: String(normalized.email || "").trim(),
        neetStatus: String(normalized.neetStatus || "").trim(),
        budget: normalized.budget ? Number(normalized.budget) : null,
        preferredCountry: String(normalized.preferredCountry || "").trim(),

        status: 'New',
        leadTag: 'Warm',
      };
    });

    // Filter only valid leads (Name + Phone must be present)
    const validLeads = leadsToInsert.filter((lead) => 
      lead.name && lead.name.trim() !== "" && 
      lead.phone && lead.phone.trim() !== ""
    );

    if (validLeads.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid student data found. Please check that your Excel has 'Name' and 'Phone' columns.",
      });
    }

    // Bulk insert into MongoDB
    const result = await Lead.insertMany(validLeads, { 
      ordered: false 
    });

    // Cleanup file from memory (Multer memoryStorage use kar rahe ho to zaruri nahi, lekin safe side)
    if (req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(201).json({
      success: true,
      message: `✅ Successfully imported ${result.length} students/leads!`,
      totalRows: jsonData.length,
      imported: result.length,
      skipped: jsonData.length - validLeads.length,
    });

  } catch (error) {
    console.error("Bulk Upload Error:", error);

    // Cleanup file in case of error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Some phone numbers already exist in the database (duplicate entries skipped).",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error while saving students.",
      error: error.message,
    });
  }
};