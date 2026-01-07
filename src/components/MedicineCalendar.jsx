import React, { useState } from "react";
import Calendar from "react-calendar";
import { useTranslation } from "react-i18next";
import "./MedicineCalendar.css";

export default function MedicineCalendar({ medicines = [] }) {
  const { t } = useTranslation();
  const [value, setValue] = useState(new Date());
  const [selectedMeds, setSelectedMeds] = useState([]);

  const calcDayIndex = (date) => (date.getDay() === 0 ? 7 : date.getDay());

  const onDateSelect = (date) => {
    setValue(date);
    const idx = calcDayIndex(date);
    setSelectedMeds(medicines.filter((m) => m.days.includes(idx)));
  };

  return (
    <div className="calendar-wrapper">
      <h3 className="calendar-title">{t("medicine_calendar")}</h3>

      <Calendar
        onChange={onDateSelect}
        value={value}
        tileClassName={({ date }) => {
          const idx = calcDayIndex(date);
          return medicines.some((m) => m.days.includes(idx))
            ? "day-has-meds"
            : "";
        }}
      />

      <div className="day-info-card">
        <h4>
          {t("medicines_for")}{" "}
          <span>{value.toDateString()}</span>
        </h4>

        {selectedMeds.length > 0 ? (
          selectedMeds.map((m) => (
            <div className="day-med-item" key={m.id}>
              <div className="pill-icon">💊</div>
              <div>
                <p className="med-title">{m.name}</p>
                <p className="med-time">⏰ {m.time}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-meds">{t("no_medicines")}</p>
        )}
      </div>
    </div>
  );
}
