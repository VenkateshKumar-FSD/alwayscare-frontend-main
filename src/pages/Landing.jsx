import React, { useState, useEffect } from "react";
import "./LandingPage.css";
import { FiBell, FiClock, FiHeart, FiCheckCircle, FiArrowUp } from "react-icons/fi";

export default function LandingPage() {
  const [scrollNav, setScrollNav] = useState(false);
  const [showTop, setShowTop] = useState(false);

    useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTop(true);
      } else {
        setShowTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="landing-body">
      {/* NAVBAR */}
      <nav className="navbar">

        <div className="nav-left">
          <img
            src="https://www.hdfcergo.com/images/default-source/health-insurance/health-insurance-for-senior-citizens.jpg"
            alt="logo"
            className="logo-img"
          />
          <div className="project-brand">
  <img
    src="https://images.squarespace-cdn.com/content/v1/64c84d50207324304e55ce7a/3d14ee4e-1bb0-420c-b567-02ec72a8e48e/AlwaysHere-Blue.png"
    alt="AlwaysHere"
    className="project-logo"
  />
</div>
        </div>

        <div className="nav-right">
          <a href="#features">Features</a>
          <a href="#why">Why Us?</a>
          <a href="#work">How It Works</a>
          <a href="#testimonials">Testimonials</a>
          <a href="/register" className="nav-btn">Get Started</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero full-width">
        <div className="hero-left">
          <h1 className="hero-title animate-slide">
            Your Health, <span>Always Protected</span> 💙
          </h1>

          <p className="hero-subtitle animate-fade">
            AlwaysHere helps senior citizens stay on time with their medicines,
            appointments, health routines, and daily care — in the simplest way.
          </p>

          <div className="hero-buttons animate-fade">
            <a className="primary-btn" href="/register">Start Free →</a>
            <a className="outline-btn" href="#work">See How It Works</a>
          </div>
        </div>

        <div className="hero-right animate-float">
          <img
            src="https://media.istockphoto.com/id/1282100097/photo/dont-forget-your-meds-application.jpg?s=612x612&w=0&k=20&c=YQAsPcRn-fnJ4yjvmdK3ARGBN0EaHBbRlGLTJUUuQ0k="
            alt="Medication Reminder"
          />
        </div>
      </section>
      {/* ---------------- FEATURES ---------------- */}
<section id="features" className="features full-width">
  <h2 className="section-title">Powerful Features</h2>

  <div className="features-grid">

    <div className="feature-card">
      <h3>Medicine Reminders</h3>
      <p>Never miss your dose. Get timely alerts with sound + vibration.</p>
    </div>

    <div className="feature-card">
      <h3>Daily Health Tracking</h3>
      <p>Track your routine, habits, and check your overall progress.</p>
    </div>

    <div className="feature-card">
      <h3>Caregiver Alerts</h3>
      <p>Share notifications with family for extra support.</p>
    </div>

    <div className="feature-card">
      <h3>Simple Dashboard</h3>
      <p>Clean and accessible UI for all age groups.</p>
    </div>

  </div>
</section>


      {/* WHY CHOOSE US */}
      <section id="why" className="why full-width">
        <h2 className="section-title">Why Choose AlwaysHere?</h2>

        <div className="why-grid">
          <div className="why-card">
            <FiHeart className="why-icon red" />
            <h3>Designed For Seniors</h3>
            <p>Simple, clean & effortless for elderly people.</p>
          </div>

          <div className="why-card">
            <FiCheckCircle className="why-icon green" />
            <h3>100% Reliable Reminders</h3>
            <p>Loud alerts, vibration support & accurate timing.</p>
          </div>

          <div className="why-card">
            <FiClock className="why-icon blue" />
            <h3>Daily Health Routing</h3>
            <p>Your medicines perfectly organized.</p>
          </div>

          <div className="why-card">
            <FiBell className="why-icon purple" />
            <h3>Smart Monitoring</h3>
            <p>Track doses, history & missed alerts.</p>
          </div>

         
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="work" className="work full-width">
        <h2 className="section-title">How It Works</h2>

        <div className="work-steps new-flow">
          <div className="flow-line"></div>

          <div className="flow-step">
            <span className="flow-num">1</span>
            <h3>Create Account</h3>
            <p>Quick sign-up process to get started instantly.</p>
          </div>

          <div className="flow-step">
            <span className="flow-num">2</span>
            <h3>Add Your Medicines</h3>
            <p>Customize timing, dosage and schedule.</p>
          </div>

          <div className="flow-step">
            <span className="flow-num">3</span>
            <h3>Get Reminders</h3>
            <p>Real-time alerts with sound + vibration.</p>
          </div>

          <div className="flow-step">
            <span className="flow-num">4</span>
            <h3>Stay Consistent</h3>
            <p>Track your health and never miss a dose again.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="testimonials full-width">
        <h2 className="section-title">What Our Users Say</h2>

        <div className="test-slider">
          <div className="test-card big-card">
            <img src="https://randomuser.me/api/portraits/women/65.jpg" className="test-img" />
            <h3>Priya</h3>
            <div className="rating">⭐⭐⭐⭐⭐</div>
            <p>“AlwaysHere helped my mother never miss her BP medicine.”</p>
          </div>

          <div className="test-card big-card">
            <img src="https://randomuser.me/api/portraits/men/45.jpg" className="test-img" />
            <h3>Aravind</h3>
            <div className="rating">⭐⭐⭐⭐⭐</div>
            <p>“Simple, clean UI — even my grandmother uses it easily.”</p>
          </div>

          <div className="test-card big-card">
            <img src="https://randomuser.me/api/portraits/women/32.jpg" className="test-img" />
            <h3>Kavitha</h3>
            <div className="rating">⭐⭐⭐⭐⭐</div>
            <p>“Life saver! The missed-dose alerts are extremely useful.”</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta full-width">
        <h2>Ready to Stay Healthy Every Day?</h2>
        <p>Join AlwaysHere and take control of your medicine routine.</p>
        <a className="cta-btn" href="/register">Get Started Now</a>
      </section>

    {/* BACK TO TOP BUTTON */}
      {showTop && (
        <button className="back-to-top" onClick={scrollToTop}>
          <FiArrowUp />
        </button>
)}


     {/* FOOTER */}
<footer className="footer">
  <div className="footer-container">

    {/* Brand */}
    <div className="footer-brand">
      <h3>AlwaysHere</h3>
      <p>
        Caring for seniors with timely medicine reminders, health tracking,
        and caregiver support.
      </p>
    </div>

    {/* Links */}
    <div className="footer-links">
      <h4>Quick Links</h4>
      <a href="#features">Features</a>
      <a href="#why">Why AlwaysHere</a>
      <a href="#work">How It Works</a>
      <a href="/register">Get Started</a>
    </div>

    {/* Support */}
    <div className="footer-support">
      <h4>Support</h4>
      <p>Email: support@alwayshere.com</p>
      <p>Helpline: +91 98765 43210</p>
      <p>Available 24/7</p>
    </div>

  </div>

  <div className="footer-bottom">
    © 2025 AlwaysHere. Built with care 💙
  </div>
</footer>

    </div>
  );
}
