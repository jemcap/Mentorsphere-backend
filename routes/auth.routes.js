import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import authVerification from "../middleware/auth.middleware.js";
const authRoutes = express.Router();

authRoutes.get("/", async (req, res, next) => {
  try {
    const users = await User.find().select("-password").populate("skills");
    if (!users) res.status(404).json({ message: "Users not available" });
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
    next();
  }
});

authRoutes.post("/register", async (req, res, next) => {
  const { name, email, password, location, bio } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({
      name,
      email,
      password,
      location,
      bio,
    });

    await user.save();

    res.status(201).json({ message: "User created", data: user });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
    next();
  }
});

authRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) return;
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) throw Error;
        console.log(token);
        res.json({ token });
      }
    );
    res
      .status(200)
      .json({ message: "User has successfully logged in", data: user });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: error.message });
    next();
  }
});

authRoutes.get("/profile", authVerification, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
    next();
  }
});

export default authRoutes;
