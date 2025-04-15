import express from "express";
import User from "../models/user.model.js";
import { body, validationResult } from "express-validator";
import authVerification from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("skills");
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/profile", authVerification, async (req, res) => {
  try {
    const { name, location, bio } = req.body;

    const profileFields = {};

    if (name) profileFields.name = name;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;

    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select("-password");

    res.json({ data: user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/skills", authVerification, async (req, res) => {
  try {
    const { skillId } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.skills.includes(skillId))
      return res.status(400).json({ message: "Skill already added" });
    user.skills.push(skillId);

    await user.save();

    const updatedUser = await User.findById(req.user.id)
      .select("-password")
      .populate("skills");

    res.status(200).json(updatedUser.skills);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
    next();
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) return "Valid ID must be inputted";
  try {
    const user = await User.findById(id).select("-password").populate("skills");
    if (user) res.json({ data: user });
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId")
      return res.status(404).json({ message: "User not found" });
    res.status(500).json({ message: error.message });
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
