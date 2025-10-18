import React from "react";
import { motion } from "framer-motion";
import { FaTrash, FaCheck } from "react-icons/fa";

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0.5rem",
        borderBottom: "1px solid #ccc",
        alignItems: "center",
        backgroundColor: todo.completed ? "#d4edda" : "#fff",
        cursor: "pointer",
      }}
    >
      <span
        onClick={() => onToggle(todo.id)}
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
          flexGrow: 1,
          userSelect: "none",
        }}
      >
        {todo.title}
      </span>
      <div>
        <FaCheck
          onClick={() => onToggle(todo.id)}
          style={{
            marginRight: "1rem",
            color: todo.completed ? "green" : "#ccc",
            cursor: "pointer",
          }}
          title="Toggle Complete"
        />
        <FaTrash
          onClick={() => onDelete(todo.id)}
          style={{ color: "red", cursor: "pointer" }}
          title="Delete"
        />
      </div>
    </motion.li>
  );
}
