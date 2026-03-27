import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  
  // Editing State
  const [editingId, setEditingId] = useState(null);

  // AI Summary State
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

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
    if (!title) return;
    const userId = localStorage.getItem("userId");
    try {
      const res = await axios.post("http://localhost:5000/api/task/add", {
        title,
        description,
        dueDate,
        priority,
        userId
      });
      setTasks([...tasks, res.data]);
      resetForm();
    } catch (err) {
      console.error("Add Task Error:", err);
    }
  };

  const generateSummary = async () => {
    setLoadingSummary(true);
    const userId = localStorage.getItem("userId");
    try {
      const res = await axios.post("http://localhost:5000/api/summary/generate", { userId });
      setAiSummary(res.data.text);
      setShowSummaryModal(true);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to generate summary.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("Medium");
    setEditingId(null);
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

  const startEdit = (t) => {
    setEditingId(t._id);
    setTitle(t.title);
    setDescription(t.description || "");
    setDueDate(t.dueDate ? t.dueDate.split('T')[0] : "");
    setPriority(t.priority || "Medium");
  };

  const saveEdit = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/task/${editingId}`, {
        title,
        description,
        dueDate,
        priority
      });
      setTasks(tasks.map((t) => (t._id === editingId ? res.data : t)));
      resetForm();
    } catch (err) {
      console.error("Save Edit Error:", err);
    }
  };

  const getGroupedTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    const groups = {
      today: [],
      upcoming: [],
      completed: []
    };

    tasks.forEach(t => {
      if (t.completed) {
        groups.completed.push(t);
      } else if (t.dueDate && t.dueDate.split('T')[0] === today) {
        groups.today.push(t);
      } else {
        groups.upcoming.push(t);
      }
    });

    return groups;
  };

  const groups = getGroupedTasks();

  const renderTaskCard = (t) => (
    <li key={t._id} className={`task-card ${t.completed ? "completed" : ""} priority-${t.priority.toLowerCase()}`}>
      <div className="task-header">
        <div className="task-main">
          <input 
            type="checkbox" 
            checked={t.completed} 
            onChange={() => toggleComplete(t._id, t.completed)}
            className="task-checkbox"
          />
          <div className="task-info">
            <span className="task-title">{t.title}</span>
            {t.description && <p className="task-desc">{t.description}</p>}
            <div className="task-meta">
              {t.dueDate && <span className="task-date">📅 {new Date(t.dueDate).toLocaleDateString()}</span>}
              <span className={`priority-badge ${t.priority.toLowerCase()}`}>{t.priority}</span>
            </div>
          </div>
        </div>
        <div className="task-actions">
          <button className="edit-btn" onClick={() => startEdit(t)}>Edit</button>
          <button className="delete-btn" onClick={() => deleteTask(t._id)}>Delete</button>
        </div>
      </div>
    </li>
  );

  return (
    <div className="dashboard-container">
      <h2>Todo Dashboard</h2>

      <div className="task-form card">
        <h3>{editingId ? "Edit Task" : "Add New Task"}</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          className="form-input"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="form-input"
        />
        <div className="form-row">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="form-input"
          />
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            className="form-input"
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>
        <div className="form-buttons">
          {editingId ? (
            <>
              <button onClick={saveEdit}>Save Changes</button>
              <button className="cancel-btn" onClick={resetForm}>Cancel</button>
            </>
          ) : (
            <button onClick={addTask}>Add Task</button>
          )}
        </div>
      </div>

      <div className="task-sections">
        <section className="task-section">
          <div className="section-header">
            <h3>Today's Focus <span className="badge">{groups.today.length}</span></h3>
          </div>
          <ul>{groups.today.map(renderTaskCard)}</ul>
          {groups.today.length === 0 && <p className="empty-msg">No tasks for today!</p>}
        </section>

        <section className="task-section">
          <div className="section-header">
            <h3>Upcoming <span className="badge">{groups.upcoming.length}</span></h3>
          </div>
          <ul>{groups.upcoming.map(renderTaskCard)}</ul>
        </section>

        <section className="task-section">
          <div className="section-header">
            <h3>Completed <span className="badge">{groups.completed.length}</span></h3>
          </div>
          <ul className="completed-list">{groups.completed.map(renderTaskCard)}</ul>
        </section>
      </div>

      <div className="summary-section">
        <button 
          className="generate-summary-btn" 
          onClick={generateSummary}
          disabled={loadingSummary}
        >
          {loadingSummary ? "Generating AI Summary..." : "✨ Generate Daily Summary"}
        </button>
      </div>

      {showSummaryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowSummaryModal(false)}>×</button>
            <h3>Daily Achievements Summary</h3>
            <p className="summary-text">{aiSummary}</p>
            <button onClick={() => setShowSummaryModal(false)}>Great, thanks!</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
