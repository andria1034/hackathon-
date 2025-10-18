import React from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaTrash, FaCheck } from 'react-icons/fa';

const TodoItem = ({ todo }) => {
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/todos/${todo.id}`);
      window.dispatchEvent(new Event('todoUpdated'));
      toast.success('Todo deleted');
    } catch (error) {
      toast.error('Error deleting todo');
    }
  };

  const handleToggle = async () => {
    try {
      await axiosInstance.put(`/todos/${todo.id}`, {
        completed: !todo.completed,
      });
      window.dispatchEvent(new Event('todoUpdated'));
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      style={{
        textDecoration: todo.completed ? 'line-through' : 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
      }}
    >
      {todo.title}
      <div>
        <button onClick={handleToggle}>
          <FaCheck color={todo.completed ? 'green' : 'gray'} />
        </button>
        <button onClick={handleDelete}>
          <FaTrash color="red" />
        </button>
      </div>
    </motion.li>
  );
};

export default TodoItem;
