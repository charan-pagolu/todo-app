import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setTasks(items);
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach((task) => {
        if (
          task.dueDate &&
          !task.completed &&
          task.dueDate.toDate() <= now &&
          task.dueDate.toDate() > new Date(now.getTime() - 60000) // in the last 1 min
        ) {
          alert(` Reminder: Task "${task.task}" is due now!`);
        }
      });
    }, 60000); // every 60 seconds
  
    return () => clearInterval(interval);
  }, [tasks]);
  
  const toggleComplete = async (taskId, currentStatus) => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, { completed: !currentStatus });
  };

  const deleteTask = async (taskId) => {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditText(task.task);
    setEditDueDate(
      task.dueDate ? task.dueDate.toDate().toISOString().slice(0, 16) : ''
    );
  };

  const saveEdit = async (taskId) => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      task: editText,
      dueDate: editDueDate ? new Date(editDueDate) : null,
    });
    setEditingId(null);
    setEditText('');
    setEditDueDate('');
  };

  return (
    <div>
      <h2>Your Tasks</h2>

      <button
        onClick={() => setShowCompletedOnly(!showCompletedOnly)}
        style={{
          marginBottom: '1rem',
          backgroundColor: showCompletedOnly ? '#ffcc00' : '#ddd',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        {showCompletedOnly ? 'Show All Tasks' : 'Show Completed Only'}
      </button>

      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: '8px',
          width: '100%',
          maxWidth: '300px',
          marginBottom: '1rem',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks
          .filter((task) => !showCompletedOnly || task.completed)
          .filter((task) => task.task.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((task) => (
            <li
              key={task.id}
              style={{
                padding: '10px',
                margin: '10px 0',
                backgroundColor: '#f2f2f2',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1 }}>
                {editingId === task.id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      style={{ marginBottom: '5px' }}
                    />
                    <br />
                    <input
                      type="datetime-local"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      style={{ marginTop: '5px' }}
                    />
                  </>
                ) : (
                  <>
                    <strong>{task.task}</strong>
                    {task.dueDate && (
                      <div>
                        Due: {task.dueDate.toDate().toLocaleString()}
                      </div>
                    )}
                    <div>
                      Status:{' '}
                      <button
                        onClick={() => toggleComplete(task.id, task.completed)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.1rem',
                          color: task.completed ? 'green' : 'red',
                        }}
                      >
                        {task.completed ? 'yes Completed' : 'no Incomplete'}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div style={{ marginLeft: '20px' }}>
                {editingId === task.id ? (
                  <button
                    onClick={() => saveEdit(task.id)}
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                    }}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(task)}
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                    }}
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => deleteTask(task.id)}
                  style={{
                    backgroundColor: '#ff4d4d',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default TaskList;
