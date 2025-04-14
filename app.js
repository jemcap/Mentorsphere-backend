import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { PORT } from "./config/env.js";

import connectDB from "./config/db.js";

import userRouter from "./routes/users.routes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

export default app;
