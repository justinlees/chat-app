const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const signUp = async (req, res) => {
  try {
    console.log("SignUp request received:");
    const { name, email, password, mobile } = req.body;
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be of at least 6 characters" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        mobile,
      });

      if (!newUser) {
        return res.status(500).json({ message: "User creation failed" });
      }

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.cookie(`token`, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
      });

      console.log("SignUp successful");
      const user = await User.findOne({ email }).select("-password");
      return res
        .status(201)
        .json({ message: "User created successfully", user });
    }
    return res.status(400).json({ message: "User already exists" });
  } catch (error) {
    console.error("Error in signUp:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  console.log("Login Request");
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const UserDetails = await User.findOne({ email });
    if (!UserDetails) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const checkPassword = await bcrypt.compare(password, UserDetails.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = await User.findOne({ email }).select("-password");

    const token = jwt.sign({ id: UserDetails._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie(`token`, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
    });

    console.log("Login successful");
    return res.status(200).json({ message: "Login success", user });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginGet = async (req, res) => {
  try {
    const cookieExist = req.cookies.token;
    const decoded = jwt.verify(cookieExist, process.env.JWT_SECRET);
    if (cookieExist) {
      const user = await User.findOne({ _id: decoded.id }).select("-password");
      return res.status(200).json({ message: "User Token exist", user });
    }
  } catch (error) {
    return res.status(401).json({ message: "No Token" });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie(`token`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
    return res.status(200).json({ message: "logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Invalid Cookie" });
  }
};

module.exports = { signUp, login, loginGet, logout };
