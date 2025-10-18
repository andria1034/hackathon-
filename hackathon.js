require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan'); // სურვილისამებრ
const chalk = require('chalk');   // სურვილისამებრ
const Joi = require('joi');       // სურვილისამებრ

const app = express();
const PORT = process.env.PORT || 3000;
const TODOS_PATH = path.join(__dirname, 'data', 'todos.json');

app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // დალოგვა

// დავრწმუნდეთ რომ დატა დირექტორია და todos.json ფაილი არსებობს
function ensureTodosFile() {
  const dataDir = path.dirname(TODOS_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(TODOS_PATH)) {
    fs.writeFileSync(TODOS_PATH, '[]', 'utf-8');
  }
}

// todos.json ფაილიდან წაკითხვა
function readTodos() {
  ensureTodosFile();
  const data = fs.readFileSync(TODOS_PATH, 'utf-8');
  return JSON.parse(data);
}

// todos.json ფაილში ჩაწერა
function writeTodos(todos) {
  fs.writeFileSync(TODOS_PATH, JSON.stringify(todos, null, 2), 'utf-8');
}

// ვალიდაცია Joi-ით
const todoSchema = Joi.object({
  title: Joi.string().required(),
  completed: Joi.boolean().optional()
});

// GET /api/todos - ყველა todo-ს წაკითხვა
app.get('/api/todos', (req, res) => {
  try {
    const todos = readTodos();
    res.status(200).json(todos);
  } catch (error) {
    console.error(chalk.red('Read error:', error));
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/todos - ახალი todo-ს დამატება
app.post('/api/todos', (req, res) => {
  try {
    const { error, value } = todoSchema.validate(req.body, { presence: 'required' });
    if (error) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const todos = readTodos();

    const newTodo = {
      id: uuidv4(),
      title: value.title,
      completed: false
    };

    todos.push(newTodo);
    writeTodos(todos);

    res.status(201).json(newTodo);
  } catch (error) {
    console.error(chalk.red('Post error:', error));
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/todos/:id - todo-ს განახლება (მაგ. status toggle)
app.put('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = todoSchema.validate(req.body, { presence: 'optional' });

    if (error && error.details[0].context.key === 'title') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const todos = readTodos();
    const index = todos.findIndex(todo => todo.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // განახლება მხოლოდ იმ ველებით, რაც მომწერეს
    if (value.title !== undefined) {
      todos[index].title = value.title;
    }
    if (value.completed !== undefined) {
      todos[index].completed = value.completed;
    }

    writeTodos(todos);

    res.status(200).json(todos[index]);
  } catch (error) {
    console.error(chalk.red('Put error:', error));
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/todos/:id - todo-ს წაშლა
app.delete('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const todos = readTodos();
    const index = todos.findIndex(todo => todo.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const deletedTodo = todos.splice(index, 1)[0];
    writeTodos(todos);

    res.status(200).json(deletedTodo);
  } catch (error) {
    console.error(chalk.red('Delete error:', error));
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(chalk.green(`Server is running on port ${PORT}`));
});
