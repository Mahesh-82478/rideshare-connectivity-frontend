import { useEffect, useState } from "react";
import "./PassengerDashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

function PassengerDashboard() {
  const [rides, setRides] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);

  const fetchRides = async () => {
    if (!API_URL) {
      setMessage("Backend URL is not configured.");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/rides`);

      if (!response.ok) {
        throw new Error("Failed to fetch rides.");
      }

      const data = await response.json();

      setRides(data);
      setMessage("");
    } catch (error) {
      console.error("Fetch rides error:", error);
      setMessage("Cannot connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const requestRide = async (rideId) => {
    const savedUser = localStorage.getItem("rideshareUser");

    if (!savedUser) {
      setMessage("Please log in before requesting a ride.");
      return;
    }

    let user;

    try {
      user = JSON.parse(savedUser);
    } catch {
      setMessage("Login information is invalid. Please log in again.");
      return;
    }

    if (!user?.id) {
      setMessage("Passenger ID not found. Please log in again.");
      return;
    }

    if (!API_URL) {
      setMessage("Backend URL is not configured.");
      return;
    }

    setRequestingId(rideId);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/ride-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rideId: rideId,
          passengerId: user.id,
          status: "PENDING"
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || "Failed to send ride request."
        );
      }

      setMessage("Ride request sent successfully!");
      await fetchRides();
    } catch (error) {
      console.error("Request ride error:", error);
      setMessage(
        error.message || "Cannot connect to the backend."
      );
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="passenger-page">
      <header className="dashboard-header">
        <div>
          <h1>Passenger Dashboard</h1>
          <p>Find a ride and travel together</p>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-title">
          <h2>Available Rides</h2>

          <button
            className="refresh-btn"
            type="button"
            onClick={fetchRides}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </section>

        {message && (
          <p className="status-message">{message}</p>
        )}

        {loading && (
          <p className="status-message">Loading rides...</p>
        )}

        {!loading && rides.length === 0 && (
          <div className="no-rides">
            <h3>No rides available</h3>
            <p>Drivers have not added any rides yet.</p>
          </div>
        )}

        <div className="ride-container">
          {rides.map((ride) => (
            <div className="ride-card" key={ride.id}>
              <div className="ride-route">
                <div>
                  <span>From</span>
                  <strong>{ride.startLocation}</strong>
                </div>

                <div className="arrow">→</div>

                <div>
                  <span>To</span>
                  <strong>{ride.destination}</strong>
                </div>
              </div>

              <div className="ride-details">
                <p>
                  📅 <strong>Date:</strong> {ride.rideDate}
                </p>

                <p>
                  🕐 <strong>Time:</strong> {ride.rideTime}
                </p>

                <p>
                  💺 <strong>Available Seats:</strong>{" "}
                  {ride.availableSeats}
                </p>

                <p>
                  🚗 <strong>Vehicle:</strong> {ride.vehicleNumber}
                </p>
              </div>

              <button
                className="request-btn"
                type="button"
                onClick={() => requestRide(ride.id)}
                disabled={
                  Number(ride.availableSeats) <= 0 ||
                  requestingId !== null
                }
              >
                {requestingId === ride.id
                  ? "Sending Request..."
                  : Number(ride.availableSeats) > 0
                    ? "Request Ride"
                    : "No Seats Available"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default PassengerDashboard;