import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ theme, toggleTheme, toggleSidebar }) {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("name");
    navigate("/");
  };

  const getName = () => {
    const stored = localStorage.getItem("username") || localStorage.getItem("name");
    if (!stored || stored === "undefined" || stored === "null") return "Traveler";
    return stored;
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const username = getName();

  return (
    <nav className="navbar glass">
      <div className="nav-container">
        <div className="nav-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            ☰
          </button>
          <div className="nav-header">
            <span className="greeting">{getGreeting()}, {username}</span>
            <span className="date">
              {currentTime.toLocaleDateString(undefined, { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        <div className="nav-right">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          
          {userId && (
            <div className="user-actions">
              <button className="btn-logout" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
