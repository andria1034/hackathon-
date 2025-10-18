import React, { useEffect, useState } from "react";
import axiosInstance from "./api/axiosInstance";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [todos, setTodos] = useState([]);

  // Load todos from backend
  useEffect(() => {
    async function fetchTodos() {
      try {
        const { data } = await axiosInstance.get("/todos");
        setTodos(data);
      } catch {
        toast.error("Failed to load todos");
      }
    }
    fetchTodos();
  }, []);

  // Add new todo
  const addTodo = async (title) => {
    const { data } = await axiosInstance.post("/todos", { title });
    setTodos((prev) => [...prev, data]);
  };

  // Toggle complete status
  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    try {
      const { data } = await axiosInstance.put(`/todos/${id}`, {
        title: todo.title,
        completed: !todo.completed,
      });
      setTodos((prev) => prev.map((t) => (t.id === id ? data : t)));
      toast.success("Todo updated");
    } catch {
      toast.error("Failed to update todo");
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axiosInstance.delete(`/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));
      toast.success("Todo deleted");
    } catch {
      toast.error("Failed to delete todo");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem" }}>
      <h1 style={{ textAlign: "center" }}>Todo List</h1>
      <TodoForm onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
