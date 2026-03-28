const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = "mysecretkey"; // later move to env

// SIGNUP
const signup = async (req, res) => {
  try {
    console.log("Signup request received");

    const { email, password } = req.body;

    if (!email || !password) {
        console.log("Missing fields");
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        console.log("User already exists:",email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    const user = await User.create({
      email,
      password: hashedPassword,
    });
    console.log("User created:",user._id);
    res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    console.log("Signup error:",error.message);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    console.log("Login request received");
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        console.log("User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log("Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Login successful");
    const token = jwt.sign({ id: user._id }, SECRET, {
      expiresIn: "1d",
    });
    console.log("Token generated");

    res.json({ token });

  } catch (error) {
    console.error("Login error:",error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
};