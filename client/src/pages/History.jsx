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
    <div className="history-container">
      <h2>Daily Summary History</h2>
      {summaries.length === 0 ? (
        <p className="empty-msg">No summaries found yet. Generate one on the dashboard!</p>
      ) : (
        <div className="history-list">
          {summaries.map((s) => (
            <div key={s._id} className="history-card">
              <span className="history-date">📅 {new Date(s.date).toLocaleDateString()}</span>
              <p className="summary-text">{s.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
