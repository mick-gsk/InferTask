import express, { Request, Response } from "express";
import cors from "cors";
import tasksRouter from "./routes/tasks.js";
import inferRouter from "./routes/infer.js";
import intentRouter from "./routes/intent.js";
import goalsRouter from "./routes/goals.js";
import recommendationsRouter from "./routes/recommendations.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN ?? "http://localhost:5500",
  }),
);
app.use(express.json());
app.use("/api/tasks", tasksRouter);
app.use("/api/infer", inferRouter);
app.use("/api/intent", intentRouter);
app.use("/api/goals", goalsRouter);
app.use("/api/recommendations", recommendationsRouter);

app.get("/", function (_req: Request, res: Response) {
  res.send("InferTask API running");
});

app.use(function (_req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
});

app.listen(port, function () {
  console.log(`Server läuft auf Port ${port}`);
});
