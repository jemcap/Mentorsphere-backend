import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authRoutes = express.Router();

authRoutes.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({
      name,
      email,
      password,
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
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: error.message });
  }
});

export default authRoutes;
