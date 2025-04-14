import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) return "Valid ID must be inputted";
  try {
    const user = await User.findById(id);
    if (user) res.json({ data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    res.status(201).json({ message: "User created", data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update user
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { name, email, password } = req.body;
  try {
    const updateUser = await User.findByIdAndUpdate(id, {
      name,
      email,
      password,
    });
    res
      .status(200)
      .json({ message: "User has been updated", data: updateUser });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    if (deleteUser)
      res.status(200).json({ message: `User ${id} has been deleted` });
  } catch (error) {
    console.log(error.message);
    res.json({ message: error.message });
  }
});

export default router;
