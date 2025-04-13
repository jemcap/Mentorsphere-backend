import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { PORT } from "./config/env.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send();
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

export default app;
