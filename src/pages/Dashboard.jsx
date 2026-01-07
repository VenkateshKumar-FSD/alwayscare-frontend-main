import React, { useMemo } from "react";
import Navbar from "../components/Navbar";
import MedicineCard from "../components/MedicineCard";
import MedicineCalendar from "../components/MedicineCalendar";
import { useAuth } from "../context/AuthContext";
import MoodTracker from "../components/MoodTracker";
import WaterTracker from "../components/WaterTracker";
import BMICalculator from "../components/BMICalculator";
import { FiCheckCircle, FiClock, FiAlertTriangle } from "react-icons/fi";
import "./Dashboard.css";
import WeeklyHealthSummary from "../components/WeeklyHealthSummary";
import { useTranslation } from "react-i18next";

function getDayIdx(d = new Date()) {
  return d.getDay() === 0 ? 7 : d.getDay();
}

export default function Dashboard({
  medicines = [],
  markTaken = () => {},
  deleteMedicine = () => {},
}) {
  const { t } = useTranslation();
  const { user, darkMode } = useAuth();

  const dayIdx = getDayIdx();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  /* 🔐 USER-SPECIFIC MEDICINES */
  const userMeds = medicines.filter(
    (m) => m.userEmail === user?.email
  );

  const todayMeds = useMemo(() => {
    return userMeds
      .filter((m) => m.days.includes(dayIdx))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [userMeds, dayIdx]);

  /* ================= STATS LOGIC (FIXED) ================= */
  let takenCount = 0;
  let missedCount = 0;
  let pendingCount = 0;

  todayMeds.forEach((m) => {
    const key = `${m.id}_${now.toDateString()}`;

    const [hh, mm] = m.time.split(":").map(Number);
    const medMinutes = hh * 60 + mm;

    if (m.taken?.[key] === "taken") {
      takenCount++;
    } else if (currentMinutes > medMinutes) {
      missedCount++; // ✅ TIME PASSED = MISSED
    } else {
      pendingCount++; // ⏳ UPCOMING
    }
  });

  /* 🔐 USER-SPECIFIC STORAGE */
  const moodKey = `alwayshere_mood_${user?.email}`;
  const waterKey = `water_history_${user?.email}`;

  const moodHistory = JSON.parse(
    localStorage.getItem(moodKey) || "[]"
  );

  const waterHistory = JSON.parse(
    localStorage.getItem(waterKey) || "{}"
  );

  return (
    <div className={darkMode ? "dash-dark" : "dash-light"}>
      <Navbar />

      <div className="page">
        <h2 className="dash-title">
          {t("greet")}, {user?.name} 👋
        </h2>

        {/* ================= STATS ================= */}
        <div className="cards-row">
          <div className="card small">
            <FiCheckCircle className="stat-icon green" />
            <div className="card-title">{t("taken")}</div>
            <div className="card-num green">{takenCount}</div>
          </div>

          <div className="card small">
            <FiClock className="stat-icon yellow" />
            <div className="card-title">{t("pending")}</div>
            <div className="card-num yellow">{pendingCount}</div>
          </div>

          <div className="card small">
            <FiAlertTriangle className="stat-icon red" />
            <div className="card-title">{t("missed")}</div>
            <div className="card-num red">{missedCount}</div>
          </div>
        </div>

        {/* ================= TODAY MEDS ================= */}
        <h2 className="med-title">{t("Todays medicine")}</h2>

        <div className="med-list">
          {todayMeds.length === 0 && (
            <div className="card empty">{t("no_meds")}</div>
          )}

          {todayMeds.map((m) => (
            <MedicineCard
              key={m.id}
              med={m}
              markTaken={markTaken}
              deleteMedicine={deleteMedicine}
            />
          ))}
        </div>

        {/* ================= CALENDAR + RIGHT PANEL ================= */}
        <div className="dashboard-grid">
          <MedicineCalendar medicines={userMeds} />

          <div className="right-panel">
            <WaterTracker />
            <BMICalculator />
          </div>
        </div>

        {/* ================= MOOD ================= */}
        <div className="dashboard-grid full">
          <MoodTracker />
        </div>

        {/* ================= WEEKLY SUMMARY ================= */}
        <WeeklyHealthSummary
          medicines={userMeds}
          moodHistory={moodHistory}
          waterHistory={waterHistory}
        />
      </div>

      {/* ================= SOS ================= */}
      {isMobile ? (
        <a href="tel:+918754747687" className="sos-floating">
          🚨 SOS
        </a>
      ) : (
        <button
          className="sos-floating"
          onClick={() =>
            alert("Emergency calling works only on mobile devices")
          }
        >
          🚨 SOS
        </button>
      )}
    </div>
  );
}
