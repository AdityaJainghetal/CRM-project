const express = require('express');
const router = express.Router();
const multer = require('multer');
const Lead = require('../models/lead/LeadModel'); // your leadSchema model
const { bulkUploadLeads } = require('../controller/leadController');

// Multer setup (memory storage is best for Excel)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/bulk-upload', upload.single('file'), bulkUploadLeads);

module.exports = router;