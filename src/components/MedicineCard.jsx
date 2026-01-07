import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

/* ⏰ 12 hour format */
function format12(time24) {
  const [hh, mm] = time24.split(":").map(Number);
  const isAM = hh < 12;
  const h = hh % 12 === 0 ? 12 : hh % 12;
  return `${h}:${String(mm).padStart(2, "0")} ${isAM ? "AM" : "PM"}`;
}

export default function MedicineCard({
  med,
  markTaken = () => {},
  deleteMedicine = () => {},
}) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const alertSavedRef = useRef(false);

  const now = new Date();

  /* 🔹 Minutes calculation */
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [hh, mm] = med.time.split(":").map(Number);
  const medMinutes = hh * 60 + mm;

  /* 🔹 Daily taken key */
  const key = `${med.id}_${now.toDateString()}`;

  /* 🔹 STATUS LOGIC */
  let state = "upcoming";

  if (med.taken?.[key] === "taken") {
    state = "taken";
  } else if (currentMinutes > medMinutes) {
    state = "missed";
  } else {
    state = "pending";
  }

  /* 🔥 SAVE ALERT WHEN MISSED (ONLY ONCE) */
  useEffect(() => {
    if (state === "missed" && user && !alertSavedRef.current) {
      const alertKey = `alwayshere_alerts_${user.email}`;

      const existing = JSON.parse(
        localStorage.getItem(alertKey) || "[]"
      );

      const alreadyExists = existing.some(
        (a) =>
          a.medId === med.id &&
          a.date === now.toDateString()
      );

      if (!alreadyExists) {
        const newAlert = {
          id: Date.now(),
          medId: med.id,
          name: med.name,
          time: med.time,
          date: now.toDateString(),
          type: "missed",
        };

        localStorage.setItem(
          alertKey,
          JSON.stringify([newAlert, ...existing])
        );
      }

      alertSavedRef.current = true;
    }
  }, [state, user, med, now]);

  return (
    <div className={`med-card ${state}`}>
      <div>
        <div className="med-name">{med.name}</div>
        <div className="muted">
          {med.dose} • {format12(med.time)}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {state === "pending" && (
          <button
            className="btn small"
            onClick={() => markTaken(med.id)}
          >
            {t("mark_taken")}
          </button>
        )}

        <button
          className="btn small ghost"
          onClick={() => deleteMedicine(med.id)}
        >
          {t("delete")}
        </button>
      </div>
    </div>
  );
}
