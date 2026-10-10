import { useEffect, useState } from "react";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [rides, setRides] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("rideshareUser");

    if (!savedUser) {
      setError("Please log in to view your bookings.");
      return;
    }

    let user;

    try {
      user = JSON.parse(savedUser);
    } catch {
      setError("Login information is invalid. Please log in again.");
      return;
    }

    if (!user.id) {
      setError("Passenger ID not found. Please log in again.");
      return;
    }

    Promise.all([
      fetch("http://localhost:8080/api/bookings").then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      }),
      fetch("http://localhost:8080/api/rides").then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      }),
    ])
      .then(([allBookings, rideData]) => {
        setBookings(
          allBookings
        );
        setRides(rideData);
      })
      .catch(() => {
        setError("Unable to load bookings. Please check the backend.");
      });
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", padding: 20 }}>
      <h1>My Bookings</h1>
      <p>View your confirmed ride bookings here.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && bookings.length === 0 && (
        <p>No bookings found for your account.</p>
      )}

      {bookings.map((booking) => {
        const ride = rides.find(
          (item) => Number(item.id) === Number(booking.rideId)
        );

        return (
          <div
            key={booking.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <h3>Booking #{booking.id}</h3>

            {ride ? (
              <>
                <p><strong>From:</strong> {ride.startLocation}</p>
                <p><strong>To:</strong> {ride.destination}</p>
                <p><strong>Date:</strong> {ride.rideDate}</p>
                <p><strong>Time:</strong> {ride.rideTime}</p>
                <p><strong>Vehicle:</strong> {ride.vehicleNumber}</p>
              </>
            ) : (
              <p>Ride details unavailable. Ride ID: {booking.rideId}</p>
            )}

            <p><strong>Status:</strong> {booking.status}</p>
            <p>
              <strong>Booking time:</strong>{" "}
              {booking.bookingTime
                ? new Date(booking.bookingTime).toLocaleString()
                : "Not available"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
