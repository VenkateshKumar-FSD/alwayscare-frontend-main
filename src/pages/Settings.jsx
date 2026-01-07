import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";

/* LOCAL STORAGE KEY */
const SETTINGS_KEY = "app_settings_v1";

export default function Settings() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const [settings, setSettings] = useState({
    sound: true,
    darkMode: false,
    format24: false,
  });

  /* LOAD SETTINGS */
  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  /* SAVE SETTINGS */
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    document.body.classList.toggle("dark", settings.darkMode);
  }, [settings]);

  /* HANDLERS */
  const toggleSound = () =>
    setSettings((s) => ({ ...s, sound: !s.sound }));

  const setDarkMode = (value) =>
    setSettings((s) => ({ ...s, darkMode: value }));

  const setTimeFormat = (value) =>
    setSettings((s) => ({ ...s, format24: value }));

  const handleReset = () => {
    if (window.confirm(t("reset_confirm"))) {
      localStorage.removeItem(SETTINGS_KEY);
      window.location.reload();
    }
  };

  return (
    <>
      <Navbar />

      <div className="page settings-page">
        <h2>⚙ {t("settings")}</h2>

        {/* USER INFO */}
        <div className="card">
          <strong>{user?.name}</strong>
          <div className="muted">{user?.email}</div>
        </div>

        {/* THEME */}
        <div className="card">
          <label>{t("theme")}</label>
          <div className="row">
            <button
              className={`btn ${!settings.darkMode ? "active" : "ghost"}`}
              onClick={() => setDarkMode(false)}
            >
              ☀ {t("light")}
            </button>
            <button
              className={`btn ${settings.darkMode ? "active" : "ghost"}`}
              onClick={() => setDarkMode(true)}
            >
              🌙 {t("dark")}
            </button>
          </div>
        </div>

        {/* SOUND */}
        <div className="card">
          <label>{t("alarm_sound")}</label>
          <button className="btn" onClick={toggleSound}>
            {settings.sound ? `🔊 ${t("on")}` : `🔇 ${t("off")}`}
          </button>
        </div>

        {/* TIME FORMAT */}
        <div className="card">
          <label>{t("time_format")}</label>
          <div className="row">
            <button
              className={`btn ${!settings.format24 ? "active" : "ghost"}`}
              onClick={() => setTimeFormat(false)}
            >
              {t("hour_12")}
            </button>
            <button
              className={`btn ${settings.format24 ? "active" : "ghost"}`}
              onClick={() => setTimeFormat(true)}
            >
              {t("hour_24")}
            </button>
          </div>
        </div>

        {/* RESET */}
        <div className="card danger">
          <label>{t("danger_zone")}</label>
          <button className="btn red" onClick={handleReset}>
            {t("reset_settings")}
          </button>
        </div>

        {/* LOGOUT */}
        <button className="btn ghost logout-btn" onClick={logout}>
          {t("logout")}
        </button>
      </div>
    </>
  );
}
