import "./TaskCard.css";

const TaskCard = ({ task, onToggle, onDelete, onEdit }) => {
  return (
    <div className={`task-card glass ${task.completed ? "completed" : ""} priority-${task.priority.toLowerCase()}`}>
      <div className="task-content">
        <label className="checkbox-container">
          <input 
            type="checkbox" 
            checked={task.completed} 
            onChange={() => onToggle(task._id, task.completed)}
          />
          <span className="checkmark"></span>
        </label>
        
        <div className="task-text" onClick={() => onEdit(task)}>
          <div className="task-title-row">
            <span className="task-title">{task.title}</span>
            <span className={`priority-dot priority-${task.priority.toLowerCase()}`}></span>
          </div>
          {task.description && <p className="task-description">{task.description}</p>}
          <div className="task-meta">
            {task.dueDate && (
              <span className={`task-date ${!task.completed && new Date(task.dueDate) < new Date() ? "overdue" : ""}`}>
                📅 {new Date(task.dueDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                {!task.completed && new Date(task.dueDate) < new Date() && " (Overdue)"}
              </span>
            )}
            <span className="task-category">Personal</span>
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button className="action-btn edit" onClick={() => onEdit(task)} title="Edit task">
          Edit
        </button>
        <button className="action-btn delete" onClick={() => onDelete(task._id)} title="Delete task">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
