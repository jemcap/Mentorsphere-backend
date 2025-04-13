import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Get all users " });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  res.json({ message: `Get user ${id}` });
});

router.post("/", (req, res) => {
  const body = req.body;
  res.json({ message: "Created a new user", data: body });
});

// PUT update user
router.put("/:id", (req, res) => {
  res.json({ message: `Update user with id ${req.params.id}`, data: req.body });
});

// DELETE user
router.delete("/:id", (req, res) => {
  res.json({ message: `Delete user with id ${req.params.id}` });
});

export default router;
