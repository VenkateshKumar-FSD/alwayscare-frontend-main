import React, { useMemo } from "react";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

function format12(time24) {
  const [hh, mm] = time24.split(":").map(Number);
  const am = hh < 12;
  const h = hh % 12 === 0 ? 12 : hh % 12;
  return `${h}:${String(mm).padStart(2, "0")} ${am ? "AM" : "PM"}`;
}

function getDayIdx(d = new Date()) {
  return d.getDay() === 0 ? 7 : d.getDay();
}

export default function Schedule({
  medicines = [],
  markTaken = () => {},
}) {
  const { t } = useTranslation();
  const { user } = useAuth(); // 🔐 current user
  const dayIdx = getDayIdx();
  const now = new Date();

  /* 🔐 USER-WISE + TODAY FILTER */
  const todayMeds = useMemo(() => {
    return medicines
      .filter(
        (m) =>
          m.userEmail === user?.email && // 🔥 MAIN FIX
          m.days.includes(dayIdx)
      )
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [medicines, dayIdx, user]);

  function statusOf(m) {
    const key = `${m.id}_${now.toDateString()}`;

    if (m.taken?.[key] === "taken") return "taken";
    if (m.taken?.[key] === "missed") return "missed";

    const sched = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      ...m.time.split(":").map(Number)
    );

    if (sched - now > 0) return "upcoming";
    return "pending";
  }

  return (
    <>
      <Navbar />

      <div className="page">
        <h2>{t("today_schedule")}</h2>

        <div className="schedule-table">
          <div className="table-header">
            <div>{t("time")}</div>
            <div>{t("medicine")}</div>
            <div>{t("status")}</div>
            <div>{t("action")}</div>
          </div>

          {todayMeds.length === 0 && (
            <div className="empty">
              {t("no_schedule_today")}
            </div>
          )}

          {todayMeds.map((m) => {
            const st = statusOf(m);

            return (
              <div key={m.id} className={`table-row ${st}`}>
                <div className="col-time">
                  {format12(m.time)}
                </div>

                <div className="col-name">
                  {m.name}
                  <div className="muted">{m.dose}</div>
                </div>

                <div className="col-status">
                  {st === "missed" && (
                    <span className="pill missed">
                      🔴 {t("missed")}
                    </span>
                  )}
                  {st === "pending" && (
                    <span className="pill pending">
                      🟡 {t("pending")}
                    </span>
                  )}
                  {st === "upcoming" && (
                    <span className="pill upcoming">
                      ⏰ {t("upcoming")}
                    </span>
                  )}
                  {st === "taken" && (
                    <span className="pill taken">
                      ✅ {t("taken")}
                    </span>
                  )}
                </div>

                <div className="col-action">
                  {st !== "taken" && (
                    <button
                      className="big-btn"
                      onClick={() => markTaken(m.id)}
                    >
                      {t("mark_taken")}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
