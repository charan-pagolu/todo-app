import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect, useRef } from 'react';

function ReminderChecker() {
  const notifiedTasks = useRef(new Set());

  useEffect(() => {
    const checkTasks = async () => {
      const now = new Date();
      const inFiveMin = new Date(now.getTime() + 5 * 60 * 1000);

      const snapshot = await getDocs(collection(db, 'tasks'));

      snapshot.forEach((doc) => {
        const task = doc.data();
        if (task.dueDate && !task.completed) {
          const dueDate = new Date(task.dueDate.seconds * 1000);
          const taskId = doc.id;

          if (dueDate <= inFiveMin && dueDate > now) {
            if (!notifiedTasks.current.has(taskId)) {
              alert(`⏰ Task "${task.task}" is due at ${dueDate.toLocaleTimeString()}`);
              notifiedTasks.current.add(taskId);
            }
          } else {
            // Reset notification flag if task is no longer in the 5-min window
            notifiedTasks.current.delete(taskId);
          }
        }
      });
    };

    const interval = setInterval(checkTasks, 60000); // every 1 minute
    checkTasks(); // run immediately once

    return () => clearInterval(interval);
  }, []);

  return null;
}

export default ReminderChecker;
