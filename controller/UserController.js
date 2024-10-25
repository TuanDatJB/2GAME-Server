const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendToken = require('../Utils/jwtToken')

const userController = {
  // Register
  register: async (req, res) => {
    try {
      const { email, password, phoneNumber, username } = req.body;

      // Kiểm tra xem email đã tồn tại chưa
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Tạo user mới
      const newUser = new User({
        email,
        password,
        phoneNumber,
        username // Thêm trường name vào đối tượng user

    
      });

      // Mã hóa mật khẩu trước khi lưu vào database
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);

      // Lưu user vào database
      await newUser.save();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Error registering user' });
    }
  },
  // Login
  Login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({
            success: false,
            message: "Email hoặc Mật khẩu này không đúng!!!",
        });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send({
            success: false,
            message: "Email chưa được đăng ký!!!",
        });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return res.status(400).send({
            success: false,
            message: "Mật khẩu không đúng!!!",
        });
    }
    sendToken(user, 200, res);
},
 changePassword: async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

    // Check if new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save updated user
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
}



}

module.exports = userController;
