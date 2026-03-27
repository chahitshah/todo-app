import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const getName = () => {
    const stored = localStorage.getItem("username") || localStorage.getItem("name");
    if (!stored || stored === "undefined" || stored === "null") return "Guest User";
    return stored;
  };
  const username = getName();

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-section">
          <span className="logo-text">To do list</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="nav-item" onClick={toggleSidebar}>
          <span className="icon">📅</span>
          <span>Today's View</span>
        </NavLink>
        <div className="nav-divider">Insights</div>
        <NavLink to="/history" className="nav-item" onClick={toggleSidebar}>
          <span className="icon">✓</span>
          <span>Completed History</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">{username.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <span className="user-name">{username}</span>
            <span className="user-status">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
