import React, { useState } from "react";
import { toast } from "react-toastify";

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      await onAdd(title);
      setTitle("");
      toast.success("Todo added");
    } catch (err) {
      toast.error("Failed to add todo");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Add new todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "0.5rem", width: "70%" }}
      />
      <button type="submit" style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}>
        Add
      </button>
    </form>
  );
}
