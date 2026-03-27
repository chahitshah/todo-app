import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import History from "./pages/History";
import "./index.css";

function AppContent() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  return (
    <div className="app-layout">
      {!isAuthPage && (
        <div 
          className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`} 
          onClick={toggleSidebar}
        />
      )}
      {!isAuthPage && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
      <div className="main-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!isAuthPage && <Navbar theme={theme} toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} />}
        <main className={isAuthPage ? "" : "main-content"}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
