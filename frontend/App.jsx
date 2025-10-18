import React from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="container">
      <h1>📝 Todo List</h1>
      <TodoForm />
      <TodoList />
      <ToastContainer position="top-right" />
    </div>
  );
}

export default App;
