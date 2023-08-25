const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve the frontend build
app.use(express.static(path.join(__dirname, "dist")));

// Define your API routes here
app.get("/api", (req, res) => {
  res.json({ message: "Hello from the API!" });
});

// New API route to get a list of image URLs
app.get("/api/images", (req, res) => {
  const images = fs.readdirSync(path.join(__dirname, "uploads"));
  const imageUrls = images.map((image) => `/uploads/${image}`);
  res.json({ images: imageUrls });
});

app.post("/api/upload", upload.single("image"), (req, res) => {
  // File has been uploaded and saved. You can do further processing here.
  res.json({ message: "Image uploaded successfully!" });
});

// Route to serve the frontend application
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
