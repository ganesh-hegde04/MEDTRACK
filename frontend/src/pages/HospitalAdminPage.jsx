import React, { useState } from "react";
import axios from "axios";

export default function HospitalAdminPage() {
  const [section, setSection] = useState("login");

  // Common state
  const [message, setMessage] = useState("");

  // Registration
  const [regData, setRegData] = useState({
    name: "",
    location: "",
    contact: "",
    latitude: "",
    longitude: "",
    email: "",        // Added email
    username: "",
    password: "",
  });

  // Login
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // Inventory
  const [hospitalId, setHospitalId] = useState("");
  const [antivenom, setAntivenom] = useState({ animalName: "", quantity: "" });
  const [blood, setBlood] = useState({ bloodGroup: "", quantity: "" });

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/register`, regData);
      setMessage(res.data);
      setRegData({
        name: "",
        location: "",
        contact: "",
        latitude: "",
        longitude: "",
        email: "",
        username: "",
        password: "",
      });
    } catch (error) {
      setMessage(error.response?.data || "Registration failed");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/login`, null, {
        params: loginData,
      });
      setMessage(res.data);
    } catch (error) {
      setMessage("Login failed");
    }
  };

  const updateAntivenom = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/antivenom/update`, null, {
        params: {
          hospitalId,
          animalName: antivenom.animalName,
          quantity: antivenom.quantity,
        },
      });
      setMessage(res.data);
    } catch (error) {
      setMessage("Update failed");
    }
  };

  const updateBlood = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/blood/update`, null, {
        params: {
          hospitalId,
          bloodGroup: blood.bloodGroup,
          quantity: blood.quantity,
        },
      });
      setMessage(res.data);
    } catch (error) {
      setMessage("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800 p-6 font-sans">
      <h1 className="text-3xl font-bold text-center mb-6">Hospital Admin Portal</h1>

      <div className="flex justify-center mb-6">
        {["register", "login", "antivenom", "blood"].map((key) => (
          <button
            key={key}
            onClick={() => {
              setSection(key);
              setMessage("");
            }}
            className={`px-4 py-2 mx-2 rounded ${
              section === key ? "bg-blue-600 text-white" : "bg-white shadow"
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {message && (
        <div className="text-center text-sm font-medium bg-white p-4 rounded shadow mb-6">
          {message}
        </div>
      )}

      {/* Register */}
      {section === "register" && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
          {[
            ["name", "Hospital Name"],
            ["location", "Location"],
            ["contact", "Contact"],
            ["latitude", "Latitude"],
            ["longitude", "Longitude"],
            ["email", "Admin Email"],
            ["username", "Admin Username"],
            ["password", "Admin Password"],
          ].map(([field, label]) => (
            <input
              key={field}
              type={
                field.toLowerCase().includes("password")
                  ? "password"
                  : field === "email"
                  ? "email"
                  : "text"
              }
              placeholder={label}
              value={regData[field] || ""}
              onChange={(e) => setRegData({ ...regData, [field]: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
            />
          ))}
          <button onClick={handleRegister} className="w-full bg-blue-600 text-white py-2 rounded">
            Register
          </button>
        </div>
      )}

      {/* Login */}
      {section === "login" && (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          {["username", "password"].map((field) => (
            <input
              key={field}
              type={field === "password" ? "password" : "text"}
              placeholder={field}
              value={loginData[field]}
              onChange={(e) => setLoginData({ ...loginData, [field]: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
            />
          ))}
          <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded">
            Login
          </button>
        </div>
      )}

      {/* Antivenom Update */}
      {section === "antivenom" && (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <input
            type="text"
            placeholder="Hospital ID"
            value={hospitalId}
            onChange={(e) => setHospitalId(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Animal Name"
            value={antivenom.animalName}
            onChange={(e) => setAntivenom({ ...antivenom, animalName: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={antivenom.quantity}
            onChange={(e) => setAntivenom({ ...antivenom, quantity: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />
          <button onClick={updateAntivenom} className="w-full bg-blue-600 text-white py-2 rounded">
            Update Antivenom
          </button>
        </div>
      )}

      {/* Blood Update */}
      {section === "blood" && (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <input
            type="text"
            placeholder="Hospital ID"
            value={hospitalId}
            onChange={(e) => setHospitalId(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Blood Group (e.g. A+)"
            value={blood.bloodGroup}
            onChange={(e) => setBlood({ ...blood, bloodGroup: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={blood.quantity}
            onChange={(e) => setBlood({ ...blood, quantity: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />
          <button onClick={updateBlood} className="w-full bg-blue-600 text-white py-2 rounded">
            Update Blood
          </button>
        </div>
      )}
    </div>
  );
}