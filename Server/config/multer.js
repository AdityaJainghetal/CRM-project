const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary.js");

// Allowed file types for resumes (PDF, DOC, DOCX)
const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => ({
    folder: "resumes",
    resource_type: "auto", // auto detects pdf, image, raw etc.
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    format: file.originalname.split(".").pop(), // preserves original extension
  }),
});

// File filter for security
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed!"), false);
  }
};

// Multer configuration with limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max file size (good for resumes)
  },
});

module.exports = upload;
