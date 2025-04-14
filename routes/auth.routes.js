import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
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

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw Error;
        console.log(token);
        res.json({ token });
      }
    );
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

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) throw Error;
        res.json({ token });
      }
    );
    res.status(200).json({ message: "User has successfully logged in", token });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: error.message });
    next();
  }
});

export default authRoutes;
