import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const [data, setData] = useState(null); // instead of an object
  const [loading, setLoading] = useState(true);
  const phone = localStorage.getItem("userPhone"); // or however you're storing it

  useEffect(() => {
    if (!phone) return;

    axios.get(`${BACKEND_URL}/api/appointments/user/${phone}`)
      .then(res => setData(res.data))
      .catch(err => {
        console.error("API Error:", err);
        setData({ appointments: [], notifications: [] }); // fallback to empty
      })
      .finally(() => setLoading(false));
  }, [phone]);

  if (loading) return <p>Loading...</p>;

  // Ensure `data` exists before accessing its properties
  const appointments = data?.appointments || [];
  const notifications = data?.notifications || [];

  return (
    <div>
      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        appointments.map(a => (
          <div key={a.appointmentId}>
            <p><strong>Date:</strong> {a.date}</p>
            <p><strong>Time:</strong> {a.time}</p>
            <p><strong>Doctor:</strong> {a.doctorName}</p>
            <p><strong>Hospital:</strong> {a.hospitalName}</p>
            <hr />
          </div>
        ))
      )}

      <h3>Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        notifications.map((note, index) => (
          <p key={index}>{note}</p>
        ))
      )}
    </div>
  );
};

export default Profile;