import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (name && email && password) {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password
      });

      alert("Registered successfully");
      navigate("/");
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2>Join Us</h2>
        <div className="input-group">
          <input
            placeholder="Full Name"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            placeholder="Email Address"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleRegister}>Create Account</button>
        <p>
          Already have an account? <Link to="/">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
