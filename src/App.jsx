import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddMedicine from "./pages/AddMedicine";
import Schedule from "./pages/Schedule";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import Chatbot from "./chatbot/Chatbot";
import "./chatbot/stylechat.css";
import Profile from "./pages/Profile";


import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import { loadStorage, saveStorage } from "./utils/storage";

const MED_KEY = "alwayshere_meds_v1";
const MISSED_KEY = "alwayshere_missed_v1";

function getTodayKey(d = new Date()) {
  return d.toDateString();
}
function parseTimeToDate(today, timeStr) {
  const [hh, mm] = timeStr.split(":").map(Number);
  return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hh, mm, 0);
}

export default function App() {
  const [medicines, setMedicines] = useState(() => loadStorage(MED_KEY) || []);
  const [history, setHistory] = useState(() => loadStorage(MISSED_KEY) || []);
  const audioRef = useRef(null);
  const timersRef = useRef({});

  const location = useLocation();

  // Hide navbar only on these pages:
  const hideNavbarPaths = ["/", "/login", "/register"];
  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  useEffect(() => saveStorage(MED_KEY, medicines), [medicines]);
  useEffect(() => saveStorage(MISSED_KEY, history), [history]);

  // Reminder engine
  useEffect(() => {
    Object.values(timersRef.current).forEach((t) => t.clear && t.clear());
    timersRef.current = {};

    const checkNow = () => {
      const now = new Date();
      const todayKey = getTodayKey(now);

      medicines.forEach((m) => {
        const dayIdx = now.getDay() === 0 ? 7 : now.getDay();
        if (!m.days.includes(dayIdx)) return;

        const sched = parseTimeToDate(now, m.time);
        const diffMs = sched - now;
        const key = `${m.id}_${todayKey}`;
        const takenState = m.taken?.[key];

        if (Math.abs(diffMs) < 60000 && takenState !== "taken" && takenState !== "alerted" && takenState !== "missed") {
          setMedicines((prev) =>
            prev.map((pm) =>
              pm.id === m.id
                ? { ...pm, taken: { ...(pm.taken || {}), [key]: "alerted" } }
                : pm
            )
          );

          triggerAlert(m);

          const timeoutId = setTimeout(() => {
            const all = loadStorage(MED_KEY) || [];
            const fresh = all.find((x) => x.id === m.id);
            const freshTaken = fresh?.taken?.[key];

            if (freshTaken !== "taken") {
              setMedicines((prev) =>
                prev.map((pm) =>
                  pm.id === m.id
                    ? { ...pm, taken: { ...(pm.taken || {}), [key]: "missed" } }
                    : pm
                )
              );

              const rec = {
                id: `${m.id}_${Date.now()}`,
                medId: m.id,
                name: m.name,
                time: m.time,
                date: todayKey,
                ts: new Date().toISOString(),
              };

              setHistory((h) => [rec, ...h]);
            }
          }, 10 * 60 * 1000);

          timersRef.current[key] = { id: timeoutId, clear: () => clearTimeout(timeoutId) };
        }
      });
    };

    checkNow();
    const iv = setInterval(checkNow, 15000);
    return () => {
      clearInterval(iv);
      Object.values(timersRef.current).forEach((t) => t.clear && t.clear());
      timersRef.current = {};
    };
  }, [medicines]);

  function triggerAlert(med) {
    try {
      audioRef.current?.play();
    } catch (e) {}

    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(`AlwaysHere — Time for ${med.name}`, {
          body: `${med.dose} • ${med.time}`,
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }

    setHistory((h) => [
      {
        id: `alert_${Date.now()}`,
        medId: med.id,
        name: med.name,
        time: med.time,
        date: new Date().toDateString(),
        ts: new Date().toISOString(),
        type: "alert",
      },
      ...h,
    ]);
  }

  function addMedicine(newMed) {
    setMedicines((s) => [newMed, ...s]);
  }

  function deleteMedicine(id) {
    setMedicines((s) => s.filter((m) => m.id !== id));
  }

  function markTaken(medId) {
    const key = `${medId}_${getTodayKey()}`;

    setMedicines((prev) =>
      prev.map((m) =>
        m.id === medId ? { ...m, taken: { ...(m.taken || {}), [key]: "taken" } } : m
      )
    );

    if (timersRef.current[key]) timersRef.current[key].clear?.();

    setHistory((h) => h.filter((x) => !(x.medId === medId && x.type === "alert")));
  }

  return (
    <>
      <audio ref={audioRef} src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg" preload="auto" />

      {/* ✅ Navbar shows only on internal app pages */}
      {!hideNavbar && <Navbar />}

      {/* ✅ Chatbot appears on all internal pages */}
    {!hideNavbar && <Chatbot />}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard medicines={medicines} markTaken={markTaken} deleteMedicine={deleteMedicine} /></ProtectedRoute>} />
        <Route path="/add-medicine" element={<ProtectedRoute><AddMedicine onAdd={addMedicine} /></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute><Schedule medicines={medicines} markTaken={markTaken} /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><Alerts history={history} clear={() => setHistory([])} /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
