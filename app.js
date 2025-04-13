import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { PORT } from "./config/env.js";

import { router as userRouter } from "./routes/users.routes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

export default app;
