import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function History() {
  const [summaries, setSummaries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/");
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/summary/history/${userId}`);
        setSummaries(res.data);
      } catch (err) {
        console.error("Fetch History Error:", err);
      }
    };
    fetchHistory();
  }, [navigate]);

  return (
    <div className="history-page animate-fade-in">
      <div className="page-header" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Achievement History</h2>
          <p style={{ color: 'var(--text-muted)' }}>Reflect on your past productivity and AI-powered insights.</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate("/dashboard")} style={{ padding: '10px 20px' }}>
          ← Back to Dashboard
        </button>
      </div>

      {summaries.length === 0 ? (
        <div className="card glass" style={{ textAlign: 'center', padding: '5rem 2rem', border: '2px dashed var(--border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📜</div>
          <h3 style={{ marginBottom: '0.5rem' }}>No history yet</h3>
          <p className="empty-msg" style={{ maxWidth: '400px', margin: '0 auto' }}>Master your day and generate your first AI summary on the dashboard!</p>
        </div>
      ) : (
        <div className="history-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {summaries.map((s, index) => (
            <div key={s._id} className="card glass history-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s`, padding: '1.5rem' }}>
              <div className="card-header" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge" style={{ background: 'var(--accent)', color: 'white', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700 }}>
                  {new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="summary-content" style={{ position: 'relative' }}>
                <p className="summary-text" style={{ 
                  fontSize: '1rem', 
                  lineHeight: '1.6', 
                  color: 'var(--text)',
                  fontStyle: 'italic',
                  paddingLeft: '1rem',
                  borderLeft: '4px solid var(--accent)'
                }}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
