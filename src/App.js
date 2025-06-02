import { useEffect } from 'react';
import { db } from './firebase'; // Import the Firestore database 
import { collection, getDocs } from 'firebase/firestore';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ReminderChecker from './components/ReminderChecker';
function App() {
  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      });
    };
    fetchTasks();
  } , []);
  return (
    <div className="App" style={{ padding: '2rem' }}>
      <h1>Todo App</h1>
      <TaskForm />
      <TaskList />
      <ReminderChecker />
    </div>
  );
}

export default App;
