const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const tasksRouter = require("./routes/tasks");
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
