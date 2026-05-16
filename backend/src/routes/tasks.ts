import express from "express";
const router = express.Router();

router.post("/", function (req: any, res: any) {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  const task = {
    id: crypto.randomUUID(),
    title: title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  res.status(201).json(task);
});

export default router;
