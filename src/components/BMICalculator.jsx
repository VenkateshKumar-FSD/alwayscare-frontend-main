import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function BMICalculator() {
  const { t } = useTranslation();

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);

  const calculateBMI = () => {
    if (!height || !weight) return;

    const h = height / 100;
    const result = (weight / (h * h)).toFixed(1);
    setBmi(result);
  };

  const getMessage = () => {
    if (bmi < 18.5) return t("bmi_underweight");
    if (bmi < 25) return t("bmi_normal");
    if (bmi < 30) return t("bmi_overweight");
    return t("bmi_obese");
  };

  return (
    <div className="card bmi-card">
      <h3>📊 {t("bmi_title")}</h3>

      <input
        type="number"
        placeholder={t("height_placeholder")}
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />

      <input
        type="number"
        placeholder={t("weight_placeholder")}
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <button onClick={calculateBMI}>
        {t("calculate")}
      </button>

      {bmi && (
        <div className="bmi-result">
          <strong>{t("bmi")}: {bmi}</strong>
          <p>{getMessage()}</p>
        </div>
      )}
    </div>
  );
}
