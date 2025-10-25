const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const todosFilePath = path.join(__dirname, 'data', 'todos.json');
2
// Middleware
app.use(cors());
app.use(express.json());

// Ensure todos.json exists, if not create it with []
if (!fs.existsSync(todosFilePath)) {
  fs.writeFileSync(todosFilePath, JSON.stringify([]));
}

// Helper to read todos
function readTodos() {
  const data = fs.readFileSync(todosFilePath);
  return JSON.parse(data);
}


app.get('/api/todos', (req, res) => {
  res.send('')
})

// Helper to write todos
function writeTodos(todos) {
  fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
}
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

