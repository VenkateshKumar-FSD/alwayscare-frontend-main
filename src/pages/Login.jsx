import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // ❌ No users registered
    if (users.length === 0) {
      alert("No account found. Please register first.");
      nav("/register");
      return;
    }

    // ✅ Find matching user
    const foundUser = users.find(
      (u) =>
        u.name === name.trim() &&
        u.email === email.trim()
    );

    if (!foundUser) {
      alert("Invalid username or email");
      return;
    }

    // ✅ Save current logged-in user
    localStorage.setItem(
      "medicineUser",
      JSON.stringify(foundUser)
    );

    login(foundUser);
    nav("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* BRAND */}
        <div className="auth-brand">
          <img
            src="https://www.hdfcergo.com/images/default-source/health-insurance/health-insurance-for-senior-citizens.jpg"
            alt="medical"
          />
          <h2>AlwaysHere</h2>
          <p>Senior Health Management</p>
        </div>

        {/* FORM */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your username"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className="auth-btn-primary">
            Sign In
          </button>

          <button
            type="button"
            className="auth-btn-secondary"
            onClick={() => nav("/")}
          >
            Back to Home
          </button>
        </form>
      </div>
    </div>
  );
}
