require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Schemas
const reportSchema = new mongoose.Schema({
  reporterName: String,
  category: String,
  description: String,
  location: String,
  date: String,
  time: String,
  image: String,
  video: String,
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Report = mongoose.model('Report', reportSchema);
const Admin = mongoose.model('Admin', adminSchema);

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// Seed admin account (for testing)
(async () => {
  const adminExists = await Admin.findOne({ username: 'admin' });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('password', 10);
    await Admin.create({ username: 'admin', password: hashedPassword });
    console.log('Admin account created: username="admin", password="password"');
  }
})();

// Routes
// 1. Submit a crime report
app.post('/submit-report', upload.fields([{ name: 'image' }, { name: 'video' }]), async (req, res) => {
  try {
    const report = new Report({
      reporterName: req.body.reporterName,
      category: req.body.crimeCategory,
      description: req.body.crimeDescription,
      location: req.body.location,
      date: req.body.date,
      time: req.body.time,
      image: req.files?.image?.[0]?.filename || null,
      video: req.files?.video?.[0]?.filename || null,
    });

    await report.save();
    res.status(201).json({ message: 'Report submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting report', error });
  }
});

// 2. Admin login
app.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// 3. Fetch all reports (protected route)
app.get('/get-reports', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
