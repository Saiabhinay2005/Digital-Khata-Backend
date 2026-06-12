const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const router = express.Router();


// ✅ SIGNUP
router.post("/signup", async (req, res) => {
  try {
    let { phone, password, name } = req.body;

    // ✅ Ensure string + trim
    phone = String(phone).trim();
    password = String(password).trim();
    name = String(name).trim();

    if (!phone || !password || !name) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      phone,
      password: hashedPassword,
      name
    });

    await user.save();

    res.json({ message: "Signup success ✅" });

  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    res.status(500).json({ message: "Signup error" });
  }
});


// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    let { phone, password } = req.body;

    phone = String(phone).trim();
    password = String(password).trim();

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      name: user.name   // ✅ important for multi-user
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login error" });
  }
});


// ✅ ✅ RESET PASSWORD (FINAL STABLE VERSION)
router.post("/reset-password", async (req, res) => {
  try {
    let { phone, newPassword } = req.body;

    phone = String(phone).trim();
    newPassword = String(newPassword).trim();

    if (!phone || !newPassword) {
      return res.status(400).json({
        message: "Phone and new password required"
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    // ✅ Hash new password safely
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({
      message: "Password updated ✅"
    });

  } catch (err) {
    console.log("RESET ERROR:", err);
    res.status(500).json({
      message: "Error resetting password"
    });
  }
});


module.exports = router;
