const express = require('express');
const cors = require('cors');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// 📁 Ensure uploads folder exists
const uploadPath = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ⚙️ Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const customName = req.body.fileName || 'file';
    const ext = path.extname(file.originalname);
    cb(null, customName + '_' + Date.now() + ext);
  }
});

const upload = multer({ storage });

// 📤 Upload API
app.post('/upload', upload.single('file'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      res.json({
        message: 'File uploaded successfully',
        file: req.file.filename,
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Upload failed' });
    }
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });