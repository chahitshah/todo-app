import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (name && email && password) {
      alert("Registered successfully (temporary)");
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
