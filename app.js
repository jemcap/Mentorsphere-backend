import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { PORT } from "./config/env.js";

import connectDB from "./config/db.js";

import userRouter from "./routes/users.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/", authRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

export default app;
