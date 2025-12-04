require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/Userroutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Simple request logger to help debug incoming requests
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

app.get('/', (req, res) => {
  res.send("API is running...");
});

// Mount the user routes on both paths so clients using /api/auth or /api/User work
app.use("/api/User", userRoutes);
app.use("/api/auth", userRoutes);

// Resource routes (CRUD) - all routes require authentication
const resourceRoutes = require('./routes/Resourceroutes');
app.use('/api/resources', resourceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Replace Express default HTML 404 with JSON to make debugging easier
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});
