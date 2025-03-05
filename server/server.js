// server.js
import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const DATA_FILE = "goals.json";

// Создаем файл если его нет
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]");
}

// Получить все цели
app.get("/goals", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send(err);
    res.json(JSON.parse(data));
  });
});

// Создать новую цель
app.post("/goals", (req, res) => {
  const newGoal = {
    id: Date.now(),
    ...req.body,
    completed: false,
    dateCompleted: null,
    thoughts: "",
  };

  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send(err);

    const goals = JSON.parse(data);
    goals.push(newGoal);

    fs.writeFile(DATA_FILE, JSON.stringify(goals), (err) => {
      if (err) return res.status(500).send(err);
      res.status(201).json(newGoal);
    });
  });
});

// Обновить цель
app.put("/goals/:id", (req, res) => {
  const goalId = parseInt(req.params.id);

  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send(err);

    let goals = JSON.parse(data);
    const goalIndex = goals.findIndex((g) => g.id === goalId);

    if (goalIndex === -1) return res.status(404).send("Goal not found");

    goals[goalIndex] = { ...goals[goalIndex], ...req.body };

    fs.writeFile(DATA_FILE, JSON.stringify(goals), (err) => {
      if (err) return res.status(500).send(err);
      res.json(goals[goalIndex]);
    });
  });
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
