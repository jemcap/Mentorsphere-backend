import express from "express";
import authVerification from "../middleware/auth.middleware.js";
import Skill from "../models/skills.model.js";

const skillsRouter = express.Router();

skillsRouter.post("/", authVerification, async (req, res) => {
  try {
    const { name, category, description } = req.body;
    let skill = await Skill.findOne({
      name: { $regex: new RegExp(name, "i") },
    });
    if (skill) res.status(400).json({ message: "Skill already exists" });

    skill = new Skill({
      name,
      category,
      description,
    });

    await skill.save();
    res
      .status(201)
      .json({ message: "Skill successfully added to user", data: skill });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

skillsRouter.get("/", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    res.json(skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/skills/:id
// @desc    Get skill by ID
// @access  Public
skillsRouter.get("/:id", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.json(skill);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Skill not found" });
    }
    res.status(500).send("Server error");
  }
});

export default skillsRouter;
