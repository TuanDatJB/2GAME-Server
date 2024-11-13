const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const catchAsyncError = require("./catchAsyncError.js");

const requiredSignin = catchAsyncError(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Login first to access this resource." });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
});

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    console.log(user);
    if (user.role != "admin") {
      return res.send({
        success: false,
        message: "Bạn không có quyền truy cập!!!",
      });
    }
    next();
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
};

module.exports = { requiredSignin, isAdmin };