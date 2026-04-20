// // const XLSX = require('xlsx');
// // const Lead = require('../models/lead/LeadModel');

// // exports.bulkUploadLeads = async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({ success: false, message: "No file uploaded" });
// //     }

// //     const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
// //     const sheetName = workbook.SheetNames[0];
// //     const worksheet = workbook.Sheets[sheetName];
// //     const jsonData = XLSX.utils.sheet_to_json(worksheet);

// //     const leadsToInsert = jsonData.map((row) => ({
// //       name: row["Name"] || row["name"] || "",
// //       phone: String(row["Phone Number"] || row["phone"] || "").trim(),
// //       parentName: row["Parent's Name"] || row["parentsName"] || row["Parent Name"] || "",
// //       city: row["City"] || row["city"] || "",
// //       email: row["Email"] || row["email"] || "",
// //       neetStatus: row["NEET Status"] || row["neetStatus"] || "",
// //       budget: row["Budget"] ? Number(row["Budget"]) : null,
// //       preferredCountry: row["Preferred Country"] || row["preferredCountry"] || "",
      
// //       status: 'New',
// //       leadTag: 'Warm',                    // aap change kar sakte ho
// //     }));

// //     // Filter invalid rows (no name or phone)
// //     const validLeads = leadsToInsert.filter(lead => 
// //       lead.name && lead.name.trim() !== "" && 
// //       lead.phone && lead.phone.trim() !== ""
// //     );

// //     if (validLeads.length === 0) {
// //       return res.status(400).json({ success: false, message: "No valid leads found. Check Name and Phone Number columns." });
// //     }

// //     const result = await Lead.insertMany(validLeads, { 
// //       ordered: false 
// //     });

// //     res.status(201).json({
// //       success: true,
// //       message: `Successfully imported ${result.length} students!`,
// //       totalRows: jsonData.length,
// //       imported: result.length,
// //     });

// //   } catch (error) {
// //     console.error("Bulk upload error:", error);

// //     if (error.code === 11000) {
// //       return res.status(409).json({
// //         success: false,
// //         message: "Some phone numbers already exist in the database (duplicate phone)."
// //       });
// //     }

// //     res.status(500).json({
// //       success: false,
// //       message: "Failed to save students",
// //       error: error.message
// //     });
// //   }
// // };

// const XLSX = require('xlsx');
// const Lead = require('../models/lead/LeadModel');

// const normalizeKey = (key) => {
//   if (!key) return '';
  
//   const k = key.toString().toLowerCase().trim();
  
//   if (k.includes("name") && !k.includes("parent")) return "name";
//   if (k.includes("phone") || k.includes("mobile") || k.includes("number")) return "phone";
//   if (k.includes("parent") || k.includes("father") || k.includes("mother")) return "parentName";
//   if (k.includes("city") || k.includes("location")) return "city";
//   if (k.includes("email")) return "email";
//   if (k.includes("neet")) return "neetStatus";
//   if (k.includes("budget")) return "budget";
//   if (k.includes("country") || k.includes("prefer")) return "preferredCountry";
  
//   return k; // default
// };

// exports.bulkUploadLeads = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const jsonData = XLSX.utils.sheet_to_json(worksheet);

//     if (jsonData.length === 0) {
//       return res.status(400).json({ success: false, message: "Excel file is empty" });
//     }

//     const leadsToInsert = jsonData.map((row) => {
//       const normalizedRow = {};

//       // Normalize all keys
//       Object.keys(row).forEach((key) => {
//         const normalized = normalizeKey(key);
//         normalizedRow[normalized] = row[key];
//       });

//       return {
//         name: (normalizedRow.name || "").toString().trim(),
//         phone: String(normalizedRow.phone || "").trim(),
//         parentName: (normalizedRow.parentName || "").toString().trim(),
//         city: (normalizedRow.city || "").toString().trim(),
//         email: (normalizedRow.email || "").toString().trim(),
//         neetStatus: (normalizedRow.neetStatus || "").toString().trim(),
//         budget: normalizedRow.budget ? Number(normalizedRow.budget) : null,
//         preferredCountry: (normalizedRow.preferredCountry || "").toString().trim(),

//         status: 'New',
//         leadTag: 'Warm',
//       };
//     });

//     // Filter valid leads (name aur phone dono hone chahiye)
//     const validLeads = leadsToInsert.filter(lead => 
//       lead.name && lead.name.trim() !== "" && 
//       lead.phone && lead.phone.trim() !== ""
//     );

//     if (validLeads.length === 0) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "No valid leads found. Please ensure Name and Phone columns exist in your Excel." 
//       });
//     }

//     // Insert into MongoDB
//     const result = await Lead.insertMany(validLeads, { ordered: false });

//     res.status(201).json({
//       success: true,
//       message: `Successfully imported ${result.length} students/leads!`,
//       totalRows: jsonData.length,
//       imported: result.length,
//       skipped: jsonData.length - result.length,
//     });

//   } catch (error) {
//     console.error("Bulk upload error:", error);

//     if (error.code === 11000) {
//       return res.status(409).json({
//         success: false,
//         message: "Some phone numbers already exist in the database (duplicate phone detected)."
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: "Failed to save students to database",
//       error: error.message
//     });
//   }
// };

const XLSX = require('xlsx');
const Lead = require('../models/lead/LeadModel');

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
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (!jsonData || jsonData.length === 0) {
      return res.status(400).json({ success: false, message: "Excel file is empty or invalid" });
    }

    const leadsToInsert = jsonData.map((row) => {
      const normalized = {};
      Object.keys(row).forEach(key => {
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

    // Filter valid leads
    const validLeads = leadsToInsert.filter(lead => 
      lead.name?.trim() && lead.phone?.trim()
    );

    if (validLeads.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No valid data found. Make sure your Excel has 'Name' and 'Phone' columns." 
      });
    }

    const result = await Lead.insertMany(validLeads, { ordered: false });

    res.status(201).json({
      success: true,
      message: `✅ Successfully imported ${result.length} students!`,
      totalRows: jsonData.length,
      imported: result.length,
    });

  } catch (error) {
    console.error("Bulk upload error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate phone number found. Some records were not saved."
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while saving data",
      error: error.message
    });
  }
};