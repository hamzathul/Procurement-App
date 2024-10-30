import multer from "multer";
import { extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the current directory 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save files to a 'uploads' folder
    cb(null, `${__dirname}/uploads/`);
  },
  filename: function (req, file, cb) {
    // Create a unique filename using the original name and date
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + extname(file.originalname));
  },
});

// File filter to ensure only specific file types are uploaded
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extnameMatch = filetypes.test(extname(file.originalname).toLowerCase());
  const mimetypeMatch = filetypes.test(file.mimetype);

  if (extnameMatch && mimetypeMatch) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Multer middleware for handling file uploads
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: fileFilter,
});

export default upload;
