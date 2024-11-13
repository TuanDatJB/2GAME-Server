require('dotenv').config();
const express = require("express");
const http = require("http");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const connectDB = require('./config/database');
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/errHandler');

// Connect to MongoDB
connectDB();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(errorHandler);
// Router
const apiRoutes = require("./router/index.js");
app.use("/api", apiRoutes);
// Server
server.listen(port, "0.0.0.0", () => {
  console.log(`Server started on port ${port}`);
});