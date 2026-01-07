import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function Alerts() {
  const { t } = useTranslation();
  const { user } = useAuth();

  /* 🔐 USER SPECIFIC STORAGE KEY */
  const alertKey = `alwayshere_alerts_${user?.email}`;

  const [history, setHistory] = useState([]);
  const [remindTime, setRemindTime] = useState("");

  /* 📥 Load only current user alerts */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(alertKey) || "[]");
    setHistory(stored);
  }, [alertKey]);

  /* 💾 Save alerts */
  const saveHistory = (data) => {
    localStorage.setItem(alertKey, JSON.stringify(data));
    setHistory(data);
  };

  /* 🔔 REMIND AGAIN FUNCTION */
  const handleRemind = (item) => {
    if (!remindTime) {
      alert("Please select time");
      return;
    }

    const now = new Date();
    const [h, m] = remindTime.split(":");
    const remindDate = new Date();
    remindDate.setHours(h, m, 0);

    let delay = remindDate - now;
    if (delay < 0) delay += 24 * 60 * 60 * 1000;

    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification("Medicine Reminder 💊", {
          body: `${item.name} - Time to take your medicine`,
        });
      } else {
        alert(`${item.name} medicine time!`);
      }
    }, delay);

    alert("Reminder set successfully ✅");
  };

  /* 🧹 CLEAR HISTORY */
  const clearHistory = () => {
    localStorage.removeItem(alertKey);
    setHistory([]);
  };

  return (
    <>
      <Navbar />

      <div className="page">
        <h2>{t("alerts_title")}</h2>

        {history.length === 0 && (
          <div className="card">{t("no_alerts")}</div>
        )}

        {history.map((h) => (
          <div key={h.id} className="alert-card">
            <div>
              <div style={{ fontWeight: 700 }}>
                {h.name} • {h.time}
              </div>
              <div className="muted">
                {h.date} • {t(h.type || "missed")}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="time"
                className="time-input"
                onChange={(e) => setRemindTime(e.target.value)}
              />
              <button
                className="btn small"
                onClick={() => handleRemind(h)}
              >
                {t("remind")}
              </button>
            </div>
          </div>
        ))}

        {history.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <button className="btn ghost" onClick={clearHistory}>
              {t("clear_history")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
