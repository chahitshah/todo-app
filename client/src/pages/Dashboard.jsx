import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/");
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/task/${userId}`);
        setTasks(res.data);
      } catch (err) {
        console.error("Fetch Tasks Error:", err);
      }
    };
    fetchTasks();
  }, [navigate]);

  const addTask = async () => {
    if (!task) return;
    const userId = localStorage.getItem("userId");
    const res = await axios.post("http://localhost:5000/api/task/add", {
      title: task,
      userId
    });
    setTasks([...tasks, res.data]);
    setTask("");
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/task/${id}`);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const toggleComplete = async (id, currentStatus) => {
    const res = await axios.put(`http://localhost:5000/api/task/${id}`, {
      completed: !currentStatus
    });
    setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
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
        {tasks.map((t) => (
          <li key={t._id} className={t.completed ? "completed" : ""}>
            <div className="task-content">
              <input 
                type="checkbox" 
                checked={t.completed} 
                onChange={() => toggleComplete(t._id, t.completed)}
                className="task-checkbox"
              />
              <span>{t.title}</span>
            </div>
            <button onClick={() => deleteTask(t._id)}>Delete</button>
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
