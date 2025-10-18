import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

const TodoForm = () => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      const res = await axiosInstance.post('/todos', { title });
      setTitle('');
      window.dispatchEvent(new Event('todoUpdated'));
      toast.success('Todo added!');
    } catch (error) {
      toast.error('Error adding todo');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default TodoForm;
