import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import RightPanel from "../components/RightPanel";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  const getName = () => {
    const stored = localStorage.getItem("username") || localStorage.getItem("name");
    if (!stored || stored === "undefined" || stored === "null") return "User";
    return stored;
  };
  const username = getName();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Personal");

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
        category,
        userId
      });
      setTasks([...tasks, res.data]);
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("Medium");
      setCategory(activeFilter === "Work" ? "Work" : "Personal");
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
    if (editingId === id) resetForm();
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

  return (
    <div className="dashboard-content-layout">
      <div className="dashboard-main-area">
        {/* Expanded Add Form */}
        <div className="task-form card glass animate-fade-in" style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Create New Task</h3>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="form-input"
              style={{ fontSize: '1.1rem', fontWeight: 500 }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details (optional)"
              className="form-input"
              style={{ minHeight: '80px' }}
            />
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="input-with-label">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>DUE DATE</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="input-with-label">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>PRIORITY</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-input"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="input-with-label">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
              </select>
            </div>
          </div>
          <button className="btn-primary" onClick={addTask} style={{ width: '100%', padding: '12px' }}>
            Add to My List
          </button>
        </div>

        {/* Task Sections */}
        <div className="tasks-container">
          <section className="task-section">
            <h3 className="section-title">
              Today's Focus
              <span className="badge">{groups.today.length}</span>
            </h3>
            <div className="task-list">
              {groups.today.map(t => (
                <TaskCard
                  key={t._id}
                  task={t}
                  onToggle={toggleComplete}
                  onDelete={deleteTask}
                  onEdit={startEdit}
                />
              ))}
              {groups.today.length === 0 && <p className="empty-state">No tasks for today! Enjoy your day.</p>}
            </div>
          </section>

          <section className="task-section">
            <h3 className="section-title">Upcoming <span className="badge">{groups.upcoming.length}</span></h3>
            <div className="task-list">
              {groups.upcoming.map(t => (
                <TaskCard
                  key={t._id}
                  task={t}
                  onToggle={toggleComplete}
                  onDelete={deleteTask}
                  onEdit={startEdit}
                />
              ))}
            </div>
          </section>

          <section className="task-section">
            <h3 className="section-title">Recently Completed <span className="badge">{groups.completed.length}</span></h3>
            <div className="task-list">
              {groups.completed.map(t => (
                <TaskCard
                  key={t._id}
                  task={t}
                  onToggle={toggleComplete}
                  onDelete={deleteTask}
                  onEdit={startEdit}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="summary-section card glass" style={{ marginTop: '3rem', padding: '2rem', textAlign: 'center', border: '1px solid var(--accent)', background: 'rgba(59, 130, 246, 0.05)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Daily Achievement Summary</h3>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Use AI to reflect on your completed tasks and get personalized insights.</p>
          <button className="btn-primary" onClick={generateSummary} disabled={loadingSummary} style={{ margin: '0 auto' }}>
            {loadingSummary ? "Analyzing..." : "Generate AI Summary"}
          </button>
        </div>
      </div>

      <RightPanel
        editingId={editingId}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        dueDate={dueDate}
        setDueDate={setDueDate}
        priority={priority}
        setPriority={setPriority}
        onSave={saveEdit}
        onClose={resetForm}
        onResetForm={resetForm}
      />

      {/* AI Summary Modal */}
      {showSummaryModal && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content glass">
            <button className="close-modal" onClick={() => setShowSummaryModal(false)}>×</button>
            <h3>Your Daily Summary</h3>
            <p className="summary-text">{aiSummary}</p>
            <button className="btn-primary" onClick={() => setShowSummaryModal(false)}>Great, thanks!</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
