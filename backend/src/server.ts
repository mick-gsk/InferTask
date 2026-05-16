import express from "express";
import tasksRouter from "./routes/tasks.js";
import { askOllama } from "./llm/ollama.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/tasks", tasksRouter);

app.get("/", function (req: any, res: any) {
  res.send("InferTask API running");
});

app.use(function (req: any, res: any) {
  res.status(404).send("Not found");
});

app.listen(port, function () {
  console.log(`Server läuft auf Port ${port}`);
});
