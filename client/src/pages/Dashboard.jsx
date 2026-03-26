import { useState } from "react";

function Dashboard() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (!task) return;
    setTasks([...tasks, task]);
    setTask("");
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  return (
    <div className="dashboard-container">
      <h2>Todo Dashboard</h2>

      <div className="todo-header">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul>
        {tasks.map((t, i) => (
          <li key={i}>
            <span>{t}</span>
            <button onClick={() => deleteTask(i)}>Delete</button>
          </li>
        ))}
      </ul>
      
      {tasks.length === 0 && (
        <p style={{ marginTop: '2rem', textAlign: 'center', opacity: 0.5 }}>
          Your task list is empty. Add a task to get started!
        </p>
      )}
    </div>
  );
}

export default Dashboard;
