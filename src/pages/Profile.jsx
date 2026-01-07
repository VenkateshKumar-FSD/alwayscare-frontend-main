import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./Profile.css";

const EMPTY_PROFILE = {
  photo: "",
  name: "",
  age: "",
  gender: "",
  bloodGroup: "",
  conditions: "",
  allergies: "",
  emergencyContact: "",
};

export default function Profile() {
  const { t } = useTranslation();
  const [edit, setEdit] = useState(false);

  /* ✅ Logged-in user */
  const user = JSON.parse(localStorage.getItem("alwayshere_user"));

  /* ✅ User-based key */
  const STORAGE_KEY = useMemo(() => {
    return user ? `alwayshere_user_profile_${user.email}` : null;
  }, [user]);

  const [profile, setProfile] = useState({
    ...EMPTY_PROFILE,
    name: user?.name || "",
  });

  /* ✅ LOAD PROFILE (MERGE SAFELY) */
  useEffect(() => {
    if (!STORAGE_KEY) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setProfile((prev) => ({
        ...prev,
        ...JSON.parse(saved),
      }));
    }
  }, [STORAGE_KEY]);

  /* ✅ SAVE PROFILE */
  const saveProfile = () => {
    if (!STORAGE_KEY) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setEdit(false);
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((p) => ({ ...p, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-page">
      <h2>👤 {t("profile")}</h2>

      <div className="profile-card">
        {/* PHOTO */}
        <div className="profile-photo">
          <img src={profile.photo || "/user.png"} alt="User" />

          {edit && (
            <label className="upload-btn">
              {t("change_photo")}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handlePhoto}
              />
            </label>
          )}
        </div>

        {/* DETAILS */}
        <div className="profile-details">
          <ProfileField label={t("name")} value={profile.name} edit={false} />

          <ProfileField
            label={t("age")}
            value={profile.age}
            edit={edit}
            onChange={(v) => setProfile({ ...profile, age: v })}
          />

          <ProfileField
            label={t("gender")}
            value={profile.gender}
            edit={edit}
            onChange={(v) => setProfile({ ...profile, gender: v })}
          />

          <ProfileField
            label={t("blood_group")}
            value={profile.bloodGroup}
            edit={edit}
            onChange={(v) => setProfile({ ...profile, bloodGroup: v })}
          />

          <ProfileField
            label={t("medical_conditions")}
            value={profile.conditions}
            edit={edit}
            onChange={(v) => setProfile({ ...profile, conditions: v })}
          />

          <ProfileField
            label={t("allergies")}
            value={profile.allergies}
            edit={edit}
            onChange={(v) => setProfile({ ...profile, allergies: v })}
          />

          <ProfileField
            label={t("emergency_contact")}
            value={profile.emergencyContact}
            edit={edit}
            onChange={(v) =>
              setProfile({ ...profile, emergencyContact: v })
            }
          />
        </div>
      </div>

      <div className="profile-actions">
        {edit ? (
          <>
            <button className="btn primary" onClick={saveProfile}>
              {t("save")}
            </button>
            <button className="btn ghost" onClick={() => setEdit(false)}>
              {t("cancel")}
            </button>
          </>
        ) : (
          <button className="btn primary" onClick={() => setEdit(true)}>
            {t("edit_profile")}
          </button>
        )}
      </div>
    </div>
  );
}

/* FIELD */
function ProfileField({ label, value, edit, onChange }) {
  return (
    <div className="field">
      <span>{label}</span>
      {edit ? (
        <input value={value || ""} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <strong>{value || "-"}</strong>
      )}
    </div>
  );
}
