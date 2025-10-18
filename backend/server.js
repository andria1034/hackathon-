import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import morgan from "morgan";
import chalk from "chalk";
import Joi from "joi";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(process.cwd(), "data");
const TODOS_PATH = path.join(DATA_DIR, "todos.json");

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Ensure data directory and todos.json exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}
if (!fs.existsSync(TODOS_PATH)) {
  fs.writeFileSync(TODOS_PATH, "[]", "utf-8");
}

// Read todos from file
function readTodos() {
  const data = fs.readFileSync(TODOS_PATH, "utf-8");
  return JSON.parse(data);
}

// Write todos to file
function writeTodos(todos) {
  fs.writeFileSync(TODOS_PATH, JSON.stringify(todos, null, 2), "utf-8");
}

// Validation schema
const todoSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Title is required",
    "string.empty": "Title is required",
  }),
  completed: Joi.boolean().optional(),
});

// Routes

// GET all todos
app.get("/api/todos", (req, res) => {
  try {
    const todos = readTodos();
    res.status(200).json(todos);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: "Server error" });
  }
});

// POST add new todo
app.post("/api/todos", (req, res) => {
  const { error, value } = todoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const todos = readTodos();
    const newTodo = {
      id: uuidv4(),
      title: value.title,
      completed: false,
    };
    todos.push(newTodo);
    writeTodos(todos);
    res.status(201).json(newTodo);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update todo by id (toggle completed or update title)
app.put("/api/todos/:id", (req, res) => {
  const todoId = req.params.id;
  const { error, value } = todoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const todos = readTodos();
    const index = todos.findIndex((t) => t.id === todoId);
    if (index === -1) {
      return res.status(404).json({ error: "Todo not found" });
    }
    // Update todo fields
    todos[index].title = value.title;
    if (typeof value.completed === "boolean") {
      todos[index].completed = value.completed;
    }
    writeTodos(todos);
    res.status(200).json(todos[index]);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE todo by id
app.delete("/api/todos/:id", (req, res) => {
  const todoId = req.params.id;
  try {
    let todos = readTodos();
    const index = todos.findIndex((t) => t.id === todoId);
    if (index === -1) {
      return res.status(404).json({ error: "Todo not found" });
    }
    const deleted = todos.splice(index, 1)[0];
    writeTodos(todos);
    res.status(200).json(deleted);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(chalk.green(`Server running on port ${PORT}`));
});
