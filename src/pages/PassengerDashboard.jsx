import { useEffect, useState } from "react";
import "./PassengerDashboard.css";

function PassengerDashboard() {
  const [rides, setRides] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Get all rides from backend
  const fetchRides = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/rides"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch rides");
      }

      const data = await response.json();

      setRides(data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  // Request a ride
  const requestRide = async (rideId) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/ride-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            rideId: rideId,
            passengerId: 1,
            status: "PENDING"
          })
        }
      );

      if (response.ok) {
        setMessage("Ride request sent successfully!");
      } else {
        setMessage("Failed to send ride request.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to the backend.");
    }
  };

  return (
    <div className="passenger-page">

      {/* Header */}
      <header className="dashboard-header">

        <div>
          <h1>Passenger Dashboard</h1>

          <p>
            Find a ride and travel together
          </p>
        </div>

      </header>

      {/* Main Content */}
      <main className="dashboard-content">

        <section className="dashboard-title">

          <h2>Available Rides</h2>

          <button
            className="refresh-btn"
            onClick={fetchRides}
          >
            Refresh
          </button>

        </section>

        {loading && (
          <p className="status-message">
            Loading rides...
          </p>
        )}

        {message && (
          <p className="status-message">
            {message}
          </p>
        )}

        {!loading && rides.length === 0 && (
          <div className="no-rides">
            <h3>No rides available</h3>

            <p>
              Drivers have not added any rides yet.
            </p>
          </div>
        )}

        <div className="ride-container">

          {rides.map((ride) => (

            <div
              className="ride-card"
              key={ride.id}
            >

              <div className="ride-route">

                <div>
                  <span>From</span>
                  <strong>
                    {ride.startLocation}
                  </strong>
                </div>

                <div className="arrow">
                  →
                </div>

                <div>
                  <span>To</span>
                  <strong>
                    {ride.destination}
                  </strong>
                </div>

              </div>

              <div className="ride-details">

                <p>
                  📅 <strong>Date:</strong>{" "}
                  {ride.rideDate}
                </p>

                <p>
                  🕐 <strong>Time:</strong>{" "}
                  {ride.rideTime}
                </p>

                <p>
                  💺 <strong>Available Seats:</strong>{" "}
                  {ride.availableSeats}
                </p>

                <p>
                  🚗 <strong>Vehicle:</strong>{" "}
                  {ride.vehicleNumber}
                </p>

              </div>

              <button
                className="request-btn"
                onClick={() => requestRide(ride.id)}
                disabled={ride.availableSeats <= 0}
              >
                {ride.availableSeats > 0
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