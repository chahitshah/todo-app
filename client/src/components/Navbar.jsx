import { useNavigate, Link } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">✅ TodoApp</div>
      {userId && (
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
