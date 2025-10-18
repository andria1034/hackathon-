import React from "react";
import { AnimatePresence } from "framer-motion";
import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggle, onDelete }) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      <AnimatePresence>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
