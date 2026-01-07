import React from "react";
import { useTranslation } from "react-i18next";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip
);

const moodScore = {
  very_happy: 5,
  happy: 4,
  neutral: 3,
  sad: 2,
  very_sad: 1,
};

export default function WeeklyMoodChart({ history }) {
  const { t } = useTranslation();

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const labels = last7Days.map((d) =>
    d.toLocaleDateString("en-US", { weekday: "short" })
  );

  const dataPoints = last7Days.map((day) => {
    const entry = history.find(
      (h) =>
        new Date(h.date).toDateString() === day.toDateString()
    );
    return entry ? moodScore[entry.mood] : null;
  });

  const data = {
    labels,
    datasets: [
      {
        label: t("mood_level"),
        data: dataPoints,
        borderColor: "#6366f1",
        backgroundColor: "#6366f1",
        tension: 0.4,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: (v) =>
            ["😫", "☹️", "😐", "🙂", "😀"][v - 1],
        },
      },
    },
  };

  return (
    <div className="weekly-chart">
      <h3>📊 {t("weekly_mood")}</h3>
      <Line data={data} options={options} />
    </div>
  );
}
