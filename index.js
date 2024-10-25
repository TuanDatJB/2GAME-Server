require('dotenv').config();
const express = require("express");
const http = require("http");
const cors = require('cors');
const connectDB = require('./config/database');
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);


// Connect to MongoDB
connectDB();
// Middleware
app.use(cors());
app.use(express.json());
// Router
const apiRoutes = require("./router/index.js");
app.use("/api", apiRoutes);
// Server
server.listen(port, "0.0.0.0", () => {
  console.log(`Server started on port ${port}`);
});