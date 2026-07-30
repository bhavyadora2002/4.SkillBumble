import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { creditService } from "../services/creditService";

export default function CreditsPage() {
  const { token, user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    creditService.getBalance(token).then((d) => setBalance(d.balance)).catch(() => setError("Could not load balance."));
    creditService.getTransactions(token).then((d) => setTransactions(d.transactions || [])).catch(() => {});
  }, []);

  return (
    <div className="page">
      <div className="card card--wide">
        <h1>Credits</h1>
        {error && <div className="error-banner">{error}</div>}

        <div style={{ textAlign: "center", padding: "24px 0", marginBottom: 24, background: "#f9fafb", borderRadius: 12 }}>
          <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Your Balance</p>
          <p style={{ fontSize: 40, fontWeight: 700, margin: "4px 0", color: "#4f46e5" }}>{balance}</p>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>credits</p>
        </div>

        <div className="skill-section" style={{ borderTop: "none", paddingTop: 0 }}>
          <h2>Transaction History</h2>
          {transactions.length === 0 && <p className="empty-state">No transactions yet.</p>}
          <ul className="skill-list">
            {transactions.map((t) => (
              <li key={t.transaction_id}>
                <div className="skill-meta">
                  <strong style={{ color: t.amount > 0 ? "#15803d" : "#dc2626" }}>
                    {t.amount > 0 ? "+" : ""}{t.amount}
                  </strong>
                  {" "}&middot; {t.reason}
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>
                    {new Date(t.timestamp).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
