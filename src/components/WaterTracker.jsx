import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function WaterTracker() {
  const { t } = useTranslation();
  const DAILY_GOAL = 8;

  /* ✅ Logged-in user */
  const user = JSON.parse(localStorage.getItem("medicineUser"));

  /* ✅ User-based storage key */
  const STORAGE_KEY = useMemo(() => {
    return user ? `water_history_${user.email}` : null;
  }, [user]);

  const todayKey = new Date().toDateString();

  /* 🔹 Load today's water from USER history */
  const [glasses, setGlasses] = useState(() => {
    if (!STORAGE_KEY) return 0;
    const history = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "{}"
    );
    return history[todayKey] || 0;
  });

  const [celebrate, setCelebrate] = useState(false);

  const playSound = () => {
    const audio = new Audio("/success.mp3");
    audio.play().catch(() => {});
  };

  /* 🔹 Save water history (USER BASED) */
  const saveToHistory = (count) => {
    if (!STORAGE_KEY) return;

    const history = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "{}"
    );

    history[todayKey] = count;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(history)
    );
  };

  const addGlass = () => {
    if (glasses < DAILY_GOAL) {
      const newCount = glasses + 1;
      setGlasses(newCount);
      saveToHistory(newCount);
      playSound();

      if (newCount === DAILY_GOAL) {
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 3000);
      }
    }
  };

  const reset = () => {
    setGlasses(0);
    saveToHistory(0);
    setCelebrate(false);
  };

  const percentage = Math.round((glasses / DAILY_GOAL) * 100);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="water-box">
      {celebrate && (
        <div className="celebrate-popup">
          🎉 {t("water_completed")}
        </div>
      )}

      <h3>{t("water_tracker")}</h3>

      <p className="water-count">
        {glasses} / {DAILY_GOAL} {t("glasses")}
      </p>

      <div className="water-bottle">
        <div
          className="water-level"
          style={{ height: `${percentage}%` }}
        />
      </div>

      <div className="water-buttons">
        <button onClick={addGlass}>
          + {t("add_glass")}
        </button>
        <button onClick={reset} className="reset-btn">
          {t("reset")}
        </button>
      </div>
    </div>
  );
}
