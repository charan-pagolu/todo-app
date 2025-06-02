import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

function TaskForm() {
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState(''); // Stores string from datetime-local input

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (task.trim() === '') return;

    try {
      await addDoc(collection(db, 'tasks'), {
        task,
        completed: false,
        dueDate: dueDate ? Timestamp.fromDate(new Date(dueDate)) : null, // Converts to Firestore Timestamp
        createdAt: Timestamp.now(),
      });

      setTask('');
      setDueDate('');
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Add a new task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        required
        style={{ padding: '8px', marginRight: '10px' }}
      />
      <input
        type="datetime-local"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={{ padding: '8px', marginRight: '10px' }}
      />
      <button type="submit" style={{ padding: '8px 12px' }}>
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;
