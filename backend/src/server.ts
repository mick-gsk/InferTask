import express, { Request, Response } from "express";
import tasksRouter from "./routes/tasks.js";
// TODO: import inferRouter from "./routes/infer.js" — LLM-Route (Phase 2, siehe #52)

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/tasks", tasksRouter);

app.get("/", function (_req: Request, res: Response) {
  res.send("InferTask API running");
});

app.use(function (_req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
});

app.listen(port, function () {
  console.log(`Server läuft auf Port ${port}`);
});
