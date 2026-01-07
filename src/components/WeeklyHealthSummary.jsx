import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import "./WeeklyHealthSummary.css";

const MOOD_SCORE = {
  very_happy: 5,
  happy: 4,
  neutral: 3,
  sad: 2,
  very_sad: 1,
};

export default function WeeklyHealthSummary({ medicines = [] }) {
  const { t } = useTranslation();

  // ✅ logged-in user
  const currentUser = JSON.parse(
    localStorage.getItem("medicineUser")
  );
  const userEmail = currentUser?.email;

  // ✅ USER-WISE mood history
  const moodHistory = JSON.parse(
    localStorage.getItem(`alwayshere_mood_${userEmail}`) || "[]"
  );

  // ✅ USER-WISE water history
  const waterHistory = JSON.parse(
    localStorage.getItem(`water_history_${userEmail}`) || "{}"
  );

  const data = useMemo(() => {
    return [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const key = date.toDateString();

      const medsTaken = medicines.filter(
        (m) => m.taken?.[`${m.id}_${key}`] === "taken"
      ).length;

      const moods = moodHistory.filter(
        (m) => new Date(m.date).toDateString() === key
      );

      const moodAvg =
        moods.reduce((s, m) => s + MOOD_SCORE[m.mood], 0) /
        (moods.length || 1);

      const water = waterHistory[key] || 0;

      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        medicines: medsTaken,
        mood: Number(moodAvg.toFixed(1)),
        water,
      };
    });
  }, [medicines, moodHistory, waterHistory]);

  // ✅ totals (current user only)
  const totalWater = Object.values(waterHistory).reduce(
    (a, b) => a + b,
    0
  );

  const healthScore = Math.min(
    medicines.length * 5 +
      moodHistory.length * 5 +
      totalWater,
    100
  );

  return (
    <div className="weekly-summary-wrapper">
      <div className="weekly-summary-card card">
        <h3 className="weekly-title">
          📊 {t("weekly_health_summary")}
        </h3>

        <div className="weekly-grid">
          {/* CHART */}
          <div className="weekly-chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="medicines"
                  name={t("medicines")}
                  fill="#22c55e"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="mood"
                  name={t("mood")}
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="water"
                  name={t("water")}
                  fill="#0ea5e9"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* HEALTH SCORE */}
          <div className="weekly-health">
            <div className="health-score">
              <h2>{healthScore}%</h2>
              <p>{t("health_score")}</p>
            </div>

            <ul className="health-insights">
              {totalWater < 10 && (
                <li>💧 {t("drink_more_water")}</li>
              )}
              {moodHistory.length < 3 && (
                <li>🙂 {t("track_mood_daily")}</li>
              )}
              {medicines.length > 5 && (
                <li>💊 {t("good_medicine_discipline")}</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
