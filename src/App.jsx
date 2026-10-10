import { useState } from "react";
import "./App.css";

import Register from "./pages/Register";
import Login from "./pages/login";
import PassengerDashboard from "./pages/PassengerDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import Bookings from "./pages/Bookings";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("rideshareUser")) || null;
    } catch {
      return null;
    }
  });

  const dashboardPage = (user) =>
    user?.role === "DRIVER" ? "driver-dashboard" : "passenger-dashboard";

  const handleLogin = (user) => {
    setLoggedInUser(user);
    setCurrentPage(dashboardPage(user));
  };

  const handleLogout = () => {
    localStorage.removeItem("rideshareUser");
    setLoggedInUser(null);
    setCurrentPage("home");
  };

  if (currentPage === "register") return <Register />;
  if (currentPage === "login") return <Login onLogin={handleLogin} />;
  if (currentPage === "passenger-dashboard") return <PassengerDashboard />;
  if (currentPage === "driver-dashboard") return <DriverDashboard />;
  if (currentPage === "bookings") return <Bookings />;

  const findRide = () =>
    setCurrentPage(loggedInUser ? dashboardPage(loggedInUser) : "login");

  const offerRide = () =>
    setCurrentPage(
      loggedInUser?.role === "DRIVER" ? "driver-dashboard" : "login"
    );

  const getStarted = () =>
    setCurrentPage(loggedInUser ? dashboardPage(loggedInUser) : "register");

  return (
    <div className="app">
      {/* ---------- Navigation ---------- */}
      <nav className="navbar">
        <button
          className="logo"
          onClick={() => setCurrentPage("home")}
          aria-label="RideShare home"
        >
          <span className="logo-icon">R</span>
          <span className="logo-text">
            Ride<span className="logo-highlight">Share</span>
          </span>
        </button>

        <div className="nav-links">
          <button className="nav-link" onClick={() => setCurrentPage("home")}>
            Home
          </button>

          {loggedInUser ? (
            <>
              <button
                className="nav-link"
                onClick={() => setCurrentPage(dashboardPage(loggedInUser))}
              >
                Dashboard
              </button>

              {loggedInUser.role !== "DRIVER" && (
                <button
                  className="nav-link"
                  onClick={() => setCurrentPage("bookings")}
                >
                  My Bookings
                </button>
              )}

              <button className="nav-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="nav-login"
                onClick={() => setCurrentPage("login")}
              >
                Login
              </button>
              <button
                className="nav-register"
                onClick={() => setCurrentPage("register")}
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      <main>
        {/* ---------- Hero ---------- */}
        <section className="hero">
          <div className="hero-content">
            <p className="hero-tag">Urban and rural ride sharing</p>

            <h1>RideShare Connectivity: Revolutionizing Urban and Rural Mobility</h1>

            <p className="hero-description">
              RideShare matches drivers who already have a journey planned with
              passengers heading the same way, so empty seats become shared,
              affordable trips in cities, towns and villages.
            </p>

            <div className="hero-buttons">
              <button className="primary-button" onClick={findRide}>
                Find a ride
              </button>
              <button className="secondary-button" onClick={offerRide}>
                Offer a ride
              </button>
            </div>

            <ul className="hero-benefits">
              <li>Shared costs</li>
              <li>Fewer empty seats</li>
              <li>Reaches rural routes</li>
            </ul>
          </div>

          <div className="hero-visual" aria-label="A route from a city to a village">
            <svg
              className="route-art"
              viewBox="0 0 520 440"
              role="img"
              aria-hidden="true"
            >
              {/* city skyline */}
              <g className="city">
                <rect x="30" y="300" width="34" height="90" rx="3" />
                <rect x="70" y="260" width="40" height="130" rx="3" />
                <rect x="116" y="320" width="30" height="70" rx="3" />
                <rect x="152" y="280" width="36" height="110" rx="3" />
              </g>
              <g className="city-windows">
                <rect x="40" y="312" width="6" height="6" />
                <rect x="50" y="312" width="6" height="6" />
                <rect x="40" y="328" width="6" height="6" />
                <rect x="82" y="276" width="6" height="6" />
                <rect x="94" y="276" width="6" height="6" />
                <rect x="82" y="294" width="6" height="6" />
                <rect x="94" y="312" width="6" height="6" />
                <rect x="164" y="296" width="6" height="6" />
                <rect x="176" y="312" width="6" height="6" />
              </g>

              {/* village */}
              <g className="village">
                <path d="M360 120 L392 92 L424 120 Z" />
                <rect x="368" y="120" width="48" height="38" />
                <path d="M430 138 L452 118 L474 138 Z" />
                <rect x="436" y="138" width="32" height="26" />
                <circle cx="346" cy="146" r="14" className="tree" />
                <rect x="343" y="156" width="6" height="14" className="trunk" />
              </g>

              {/* ground lines */}
              <line x1="20" y1="392" x2="200" y2="392" className="ground" />
              <line x1="330" y1="172" x2="500" y2="172" className="ground" />

              {/* route */}
              <path
                id="route"
                className="route-line"
                d="M170 392 C 230 392, 230 300, 270 260 S 330 200, 380 172"
                pathLength="1"
              />
              <circle cx="170" cy="392" r="9" className="pin pin-start" />
              <circle cx="380" cy="172" r="9" className="pin pin-end" />

              <text x="30" y="420" className="map-label">City</text>
              <text x="440" y="198" className="map-label">Village</text>
            </svg>

            <div className="trip-card">
              <p className="trip-card-title">Seat available</p>
              <div className="trip-row">
                <span>Pickup</span>
                <strong>City centre</strong>
              </div>
              <div className="trip-row">
                <span>Drop</span>
                <strong>Village stop</strong>
              </div>
              <div className="trip-row">
                <span>Cost</span>
                <strong>Split between riders</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Features ---------- */}
        <section className="features-section">
          <div className="section-heading">
            <h2>Three things RideShare does well</h2>
            <p>Built around the journeys people already make every day.</p>
          </div>

          <div className="features">
            <article className="feature-card feature-large">
              <div className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="M16 16 L21 21" />
                </svg>
              </div>
              <h3>Find a ride</h3>
              <p>
                Search rides going your way, compare options, and request a
                seat. Your bookings stay in one place so you always know what
                is confirmed.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 17 L10 11 L14 14 L20 6" />
                  <path d="M15 6 H20 V11" />
                </svg>
              </div>
              <h3>Offer a ride</h3>
              <p>
                Post a trip you are already making and fill your spare seats.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M7 5 H17 M7 9 H17 M10 5 C 16 5, 16 13, 9 13 L17 20" />
                </svg>
              </div>
              <h3>Share the cost</h3>
              <p>
                Riders split the fare, so each trip costs less than travelling
                alone.
              </p>
            </article>
          </div>
        </section>

        {/* ---------- How it works ---------- */}
        <section className="steps-section">
          <div className="section-heading">
            <h2>How a shared ride works</h2>
          </div>

          <ol className="steps">
            <li>
              <span className="step-number">1</span>
              <h3>Create an account</h3>
              <p>Register as a passenger or as a driver.</p>
            </li>
            <li>
              <span className="step-number">2</span>
              <h3>Post or search</h3>
              <p>
                Drivers publish a journey. Passengers search for one that fits.
              </p>
            </li>
            <li>
              <span className="step-number">3</span>
              <h3>Book and travel</h3>
              <p>Reserve a seat, travel together, and split the cost.</p>
            </li>
          </ol>
        </section>

        {/* ---------- Roles ---------- */}
        <section className="roles-section">
          <div className="role role-passenger">
            <h3>For passengers</h3>
            <ul>
              <li>Search available rides</li>
              <li>Request a seat on a trip</li>
              <li>Track everything in My Bookings</li>
            </ul>
          </div>

          <div className="role role-driver">
            <h3>For drivers</h3>
            <ul>
              <li>Publish a planned journey</li>
              <li>Make use of your spare seats</li>
              <li>Manage your rides from one dashboard</li>
            </ul>
          </div>
        </section>

        {/* ---------- Call to action ---------- */}
        <section className="cta-section">
          <div>
            <h2>Start sharing your next journey.</h2>
            <p>
              {loggedInUser
                ? "Your dashboard is ready."
                : "Create a free account and find or offer a ride in minutes."}
            </p>
          </div>

          <button className="primary-button" onClick={getStarted}>
            {loggedInUser ? "Go to dashboard" : "Create an account"}
          </button>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="footer">
        <div className="footer-brand">
          <span className="logo-icon">R</span>
          <span className="logo-text">
            Ride<span className="logo-highlight">Share</span>
          </span>
        </div>

        <p>Connecting people, one shared journey at a time.</p>
        <p>© {new Date().getFullYear()} RideShare. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;