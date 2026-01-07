import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert("All fields are required");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // ✅ Check if user already exists
    const exists = users.find(
      (u) => u.email === email.trim()
    );

    if (exists) {
      alert("User already exists. Please login.");
      nav("/login");
      return;
    }

    const newUser = {
      name: name.trim(),
      email: email.trim(),
    };

    // ✅ Save user in users list
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully. Please login.");
    nav("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <img
            src="https://www.hdfcergo.com/images/default-source/health-insurance/health-insurance-for-senior-citizens.jpg"
            alt="medical"
          />
          <h2>AlwaysHere</h2>
          <p>Senior Health Management</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className="auth-btn-primary">
            Create Account
          </button>

          <button
            type="button"
            className="auth-btn-secondary"
            onClick={() => nav("/login")}
          >
            Already have an account? Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
