import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import TodoItem from './TodoItem';

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    try {
      const res = await axiosInstance.get('/todos');
      setTodos(res.data);
    } catch (error) {
      console.error('Error fetching todos', error);
    }
  };

  useEffect(() => {
    fetchTodos();
    window.addEventListener('todoUpdated', fetchTodos);
    return () => window.removeEventListener('todoUpdated', fetchTodos);
  }, []);

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;

