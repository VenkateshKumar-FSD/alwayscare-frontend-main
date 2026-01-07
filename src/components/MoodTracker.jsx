import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./MoodTracker.css";
import WeeklyMoodChart from "./WeeklyMoodChart";

const MOODS = [
  { id: "very_happy", emoji: "😀", labelKey: "very_happy" },
  { id: "happy", emoji: "🙂", labelKey: "happy" },
  { id: "neutral", emoji: "😐", labelKey: "neutral" },
  { id: "sad", emoji: "☹️", labelKey: "sad" },
  { id: "very_sad", emoji: "😫", labelKey: "very_sad" }
];

const DEFAULT_SYMPTOMS = [
  "headache",
  "nausea",
  "dizziness",
  "fatigue",
  "insomnia",
  "anxiety"
];

export default function MoodTracker({ symptoms = DEFAULT_SYMPTOMS }) {
  const { t } = useTranslation();

  /* ✅ Logged-in user */
  const user = JSON.parse(localStorage.getItem("medicineUser"));

  /* ✅ user-based storage key */
  const STORAGE_KEY = useMemo(() => {
    return user ? `alwayshere_mood_${user.email}` : null;
  }, [user]);

  const [history, setHistory] = useState(() => {
    if (!STORAGE_KEY) return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedMood, setSelectedMood] = useState(null);
  const [checkedSymptoms, setCheckedSymptoms] = useState([]);
  const [note, setNote] = useState("");

  /* ✅ Save mood history */
  useEffect(() => {
    if (STORAGE_KEY) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  }, [history, STORAGE_KEY]);

  const handleSave = () => {
    if (!selectedMood) {
      alert(t("select_mood_alert"));
      return;
    }

    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood: selectedMood,
      symptoms: checkedSymptoms,
      note
    };

    setHistory((prev) => [entry, ...prev]);
    setSelectedMood(null);
    setCheckedSymptoms([]);
    setNote("");
  };

  /* WEEKEND FILTER */
  const weekendHistory = history.filter((h) => {
    const day = new Date(h.date).getDay();
    return day === 0 || day === 6;
  });

  const exportCSV = () => {
    if (weekendHistory.length === 0) {
      alert(t("no_weekend_data"));
      return;
    }

    const headers = [
      t("date"),
      t("mood"),
      t("symptoms"),
      t("notes")
    ];

    const rows = weekendHistory.map((h) => {
      const moodObj = MOODS.find((m) => m.id === h.mood);
      return [
        new Date(h.date).toLocaleString(),
        `${moodObj?.emoji} ${t(moodObj.labelKey)}`,
        h.symptoms.map((s) => t(s)).join(" | "),
        h.note || ""
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) => row.map((v) => `"${v}"`).join(","))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "weekend_mood_history.csv";
    link.click();
  };

  return (
    <section className="mood-page">
      {/* LEFT */}
      <div className="mood-left">
        <h2>🧠 {t("mood_tracker")}</h2>

        <div className="mood-icons">
          {MOODS.map((m) => (
            <button
              key={m.id}
              className={selectedMood === m.id ? "active" : ""}
              onClick={() => setSelectedMood(m.id)}
            >
              {m.emoji}
            </button>
          ))}
        </div>

        <div className="symptom-tags">
          {symptoms.map((s) => (
            <span
              key={s}
              className={checkedSymptoms.includes(s) ? "selected" : ""}
              onClick={() =>
                setCheckedSymptoms((prev) =>
                  prev.includes(s)
                    ? prev.filter((x) => x !== s)
                    : [...prev, s]
                )
              }
            >
              {t(s)}
            </span>
          ))}
        </div>

        <textarea
          placeholder={t("write_notes")}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button className="save-btn" onClick={handleSave}>
          {t("save_entry")}
        </button>
      </div>

      {/* RIGHT */}
      <div className="mood-history">
        <WeeklyMoodChart history={history} />

        <div className="history-header">
          <h3>🌤 {t("weekend_history")}</h3>
          <button className="export-btn" onClick={exportCSV}>
            ⬇ {t("export_csv")}
          </button>
        </div>

        {weekendHistory.length === 0 ? (
          <p className="empty-text">{t("no_weekend_entries")}</p>
        ) : (
          weekendHistory.map((h) => (
            <div key={h.id} className="history-row">
              <span>{MOODS.find((m) => m.id === h.mood)?.emoji}</span>
              <div>
                <div className="history-date">
                  {new Date(h.date).toLocaleDateString()}
                </div>

                {h.symptoms.length > 0 && (
                  <div className="history-symptoms">
                    {h.symptoms.map((s) => t(s)).join(", ")}
                  </div>
                )}

                {h.note && (
                  <div className="history-note">{h.note}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
