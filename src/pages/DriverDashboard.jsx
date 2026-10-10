
import { useEffect, useState } from "react";
import "./DriverDashboard.css";

function DriverDashboard() {
  const [formData, setFormData] = useState({
    startLocation: "",
    destination: "",
    rideDate: "",
    rideTime: "",
    availableSeats: "3",
    vehicleNumber: ""
  });

  const [rides, setRides] = useState([]);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);

  const user = JSON.parse(
    localStorage.getItem("rideshareUser") || "null"
  );

  const fetchRides = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/rides"
      );

      if (!response.ok) {
        throw new Error("Could not load rides");
      }

      const data = await response.json();
      setRides(data);
    } catch {
      setMessage("Could not load rides. Check the backend.");
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/ride-requests"
      );

      if (!response.ok) {
        throw new Error("Could not load requests");
      }

      const data = await response.json();
      setRequests(data);
    } catch {
      setMessage("Could not load passenger requests. Check the backend.");
    }
  };

  useEffect(() => {
    fetchRides();
    fetchRequests();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!user?.id) {
      setMessage("Please log in again before offering a ride.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/rides",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            startLocation: formData.startLocation,
            destination: formData.destination,
            rideDate: formData.rideDate,
            rideTime: formData.rideTime + ":00",
            availableSeats: Number(formData.availableSeats),
            vehicleNumber: formData.vehicleNumber,
            driverId: user.id
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to offer ride.");
      }

      setMessage("Ride offered successfully!");
      setFormData({
        startLocation: "",
        destination: "",
        rideDate: "",
        rideTime: "",
        availableSeats: "3",
        vehicleNumber: ""
      });

      await fetchRides();
    } catch (error) {
      setMessage(error.message || "Cannot connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    setAcceptingId(requestId);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/ride-requests/${requestId}/status?status=ACCEPTED`,
        {
          method: "PUT"
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Could not accept request.");
      }

      setMessage("Passenger request accepted successfully!");
      await fetchRequests();
    } catch (error) {
      setMessage(error.message || "Could not accept the request.");
    } finally {
      setAcceptingId(null);
    }
  };

  const myRides = rides.filter(
    (ride) => String(ride.driverId) === String(user?.id)
  );

  const myRideIds = new Set(
    myRides.map((ride) => String(ride.id))
  );

  const myRequests = requests.filter(
    (request) => myRideIds.has(String(request.rideId))
  );

  return (
    <div className="driver-page">
      <header className="driver-header">
        <h1>Driver Dashboard</h1>
        <p>Offer a ride and help others travel together.</p>
      </header>

      <main className="driver-content">
        <section className="offer-card">
          <h2>Offer a New Ride</h2>

          <form onSubmit={handleSubmit}>
            <label>Starting Location</label>
            <input
              name="startLocation"
              value={formData.startLocation}
              onChange={handleChange}
              placeholder="Example: Hyderabad"
              required
            />

            <label>Destination</label>
            <input
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Example: Secunderabad"
              required
            />

            <div className="driver-form-row">
              <div>
                <label>Travel Date</label>
                <input
                  type="date"
                  name="rideDate"
                  value={formData.rideDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Travel Time</label>
                <input
                  type="time"
                  name="rideTime"
                  value={formData.rideTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label>Available Passenger Seats</label>
            <input
              type="number"
              name="availableSeats"
              min="1"
              value={formData.availableSeats}
              onChange={handleChange}
              required
            />

            <label>Vehicle Number</label>
            <input
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              placeholder="Example: TS09AB1234"
              required
            />

            <button
              className="offer-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Offer Ride"}
            </button>
          </form>
        </section>

        {message && (
          <p className="driver-message">{message}</p>
        )}

        <section className="my-rides-section">
          <h2>Passenger Requests</h2>

          <button
            className="driver-refresh"
            onClick={() => {
              fetchRides();
              fetchRequests();
            }}
          >
            Refresh Requests
          </button>

          {myRequests.length === 0 ? (
            <p className="empty-rides">
              No passenger requests found for your rides yet.
            </p>
          ) : (
            <div className="my-rides-list">
              {myRequests.map((request) => {
                const ride = myRides.find(
                  (item) =>
                    String(item.id) === String(request.rideId)
                );

                return (
                  <div className="my-ride-card" key={request.id}>
                    <h3>
                      {ride
                        ? `${ride.startLocation} → ${ride.destination}`
                        : `Ride #${request.rideId}`}
                    </h3>

                    <p>Request ID: {request.id}</p>
                    <p>Passenger ID: {request.passengerId}</p>
                    <p>Status: {request.status}</p>

                    {String(request.status).toUpperCase() === "PENDING" ? (
                      <button
                        className="offer-submit"
                        onClick={() => handleAccept(request.id)}
                        disabled={acceptingId !== null}
                      >
                        {acceptingId === request.id
                          ? "Accepting..."
                          : "Accept Request"}
                      </button>
                    ) : (
                      <p>This request has already been processed.</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="my-rides-section">
          <h2>My Offered Rides</h2>

          {myRides.length === 0 ? (
            <p className="empty-rides">
              You have not offered any rides yet.
            </p>
          ) : (
            <div className="my-rides-list">
              {myRides.map((ride) => (
                <div className="my-ride-card" key={ride.id}>
                  <h3>
                    {ride.startLocation} → {ride.destination}
                  </h3>
                  <p>Date: {ride.rideDate}</p>
                  <p>Time: {ride.rideTime}</p>
                  <p>Available seats: {ride.availableSeats}</p>
                  <p>Vehicle: {ride.vehicleNumber}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default DriverDashboard;
