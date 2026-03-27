import "./RightPanel.css";
import TaskCard from "../components/TaskCard";

const RightPanel = ({ task, onClose, onSave, onResetForm, editingId, title, setTitle, description, setDescription, dueDate, setDueDate, priority, setPriority }) => {
  if (!editingId && !task) return null;

  return (
    <div className={`right-panel glass ${editingId ? "active" : ""}`}>
      <div className="panel-header">
        <h3>{editingId ? "Edit Task" : "Task Details"}</h3>
        <button className="close-panel" onClick={onClose}>×</button>
      </div>

      <div className="panel-body">
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What needs to be done?"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Due Date & Time</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="panel-actions">
          <button className="btn-primary" onClick={onSave}>Save Changes</button>
          <button className="btn-secondary" onClick={onResetForm}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
