import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import "./AddMedicine.css";

export default function AddMedicine({ onAdd = () => {} }) {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    dose: "",
    time: "08:00",
    days: "daily",
  });

  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();

    if (!form.name.trim()) return setError(t("error_medicine_name"));
    if (!form.dose.trim()) return setError(t("error_dosage"));

    let daysArr = [];
    if (form.days === "daily") daysArr = [1, 2, 3, 4, 5, 6, 7];
    else if (form.days === "weekdays") daysArr = [1, 2, 3, 4, 5];
    else {
      daysArr = form.days
        .split(",")
        .map((s) => Number(s.trim()))
        .filter(Boolean);
    }

    const newMed = {
      id: Date.now(),
      name: form.name.trim(),
      dose: form.dose.trim(),
      time: form.time,
      days: daysArr,
      taken: {},
      userEmail: user?.email,
    };

    onAdd(newMed);
    nav("/dashboard");
  }

  return (
    <div className="add-page">
      <div className="add-card fade-in">
        <h2 className="title">{t("add_medicine")}</h2>
        <p className="subtitle">{t("add_medicine_subtitle")}</p>

        <form onSubmit={submit} className="form">
          {/* MEDICINE NAME */}
          <div className="form-group">
            
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder={t("medicine_placeholder")}
            />
          </div>

          {/* DOSAGE */}
          <div className="form-group">
            
            <input
              value={form.dose}
              onChange={(e) =>
                setForm({ ...form, dose: e.target.value })
              }
              placeholder={t("dosage_placeholder")}
            />
          </div>

          {/* TIME */}
          <div className="form-group">
            
            <input
              type="time"
              value={form.time}
              onChange={(e) =>
                setForm({ ...form, time: e.target.value })
              }
            />
          </div>

          {/* DAYS */}
          <div className="form-group">
            
            <select
              value={form.days}
              onChange={(e) =>
                setForm({ ...form, days: e.target.value })
              }
            >
              <option value="daily">{t("daily")}</option>
              <option value="weekdays">{t("weekdays")}</option>
              <option value="1,3,5">{t("mon_wed_fri")}</option>
              <option value="2,4,6">{t("tue_thu_sat")}</option>
            </select>
          </div>

          {error && <div className="error">{error}</div>}

          {/* ACTIONS */}
          <div className="btn-row">
            <button className="btn-primary" type="submit">
              {t("save")}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => nav("/dashboard")}
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
