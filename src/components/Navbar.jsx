import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiBell,
  FiPlusCircle,
  FiSettings,
  FiCalendar,
  FiHome,
  FiMenu,
  FiX,
  FiLogOut,
  FiGlobe,
  FiUser
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ta" : "en");
  };

  return (
    <header className="navbar">
  {/* LEFT */}
  <div className="nav-left">
    <div className="logo-box">
      <img
        src="https://www.hdfcergo.com/images/default-source/health-insurance/health-insurance-for-senior-citizens.jpg"
        alt="AlwaysHere"
        className="nav-logo"
      />
      <div className="brand-text">
        <span className="brand-name">AlwaysHere</span>
        <span className="brand-tagline">Medicine Reminder System</span>
      </div>
    </div>
  </div>

  {/* HAMBURGER */}
  <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
    {menuOpen ? <FiX /> : <FiMenu />}
  </div>

  {/* NAV LINKS */}
  <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
    <Link to="/dashboard"><FiHome /> {t("dashboard")}</Link>
    <Link to="/schedule"><FiCalendar /> {t("schedule")}</Link>
    <Link to="/add-medicine"><FiPlusCircle /> {t("add")}</Link>
    <Link to="/alerts"><FiBell /> {t("alerts")}</Link>
    <Link to="/settings"><FiSettings /> {t("settings")}</Link>

    <button className="nav-link-btn" onClick={toggleLang}>
      <FiGlobe /> {i18n.language === "en" ? "தமிழ்" : "English"}
    </button>

    <button className="nav-link-btn logout-link" onClick={handleLogout}>
      <FiLogOut /> {t("logout")}
    </button>
  </nav>

  {/* PROFILE */}
  <div
    className="nav-right user-profile"
    onClick={() => nav("/profile")}
  >
    <div className="user-circle">
      {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
    </div>
    <span className="user-name">{user?.name || t("guest")}</span>
  </div>
</header>

  );
}
