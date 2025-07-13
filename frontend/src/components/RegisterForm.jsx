import { useState } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contact: "",
    latitude: "",
    longitude: "",
    username: "",
    adminPassword: "",
  });

  const [message, setMessage] = useState({ type: "", content: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    // Check all fields are filled
    const allFilled = Object.values(formData).every((field) => field.trim() !== "");
    if (!allFilled) return false;

    // Check latitude and longitude are valid numbers
    const lat = parseFloat(formData.latitude);
    const long = parseFloat(formData.longitude);
    if (isNaN(lat) || isNaN(long)) return false;

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ type: "error", content: "Please fill all fields correctly, including valid latitude and longitude." });
      return;
    }

    const payload = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    };

    try {
      const response = await fetch("http://localhost:8080/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const textResponse = await response.text();
        setMessage({ type: "success", content: textResponse });

        setFormData({
          name: "",
          location: "",
          contact: "",
          latitude: "",
          longitude: "",
          adminUsername: "",
          adminPassword: "",
        });
      } else {
        const errText = await response.text();
        setMessage({ type: "error", content: errText || "Registration failed." });
      }
    } catch (error) {
      setMessage({ type: "error", content: "An error occurred. Please try again later." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 bg-white rounded shadow">
      {message.content && (
        <div
          className={`p-3 rounded text-sm ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
          role="alert"
        >
          {message.content.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}

      {[
        { label: "Hospital Name", name: "name", type: "text" },
        { label: "Location", name: "location", type: "text" },
        { label: "Contact Number", name: "contact", type: "tel" },
        { label: "Latitude", name: "latitude", type: "text", inputMode: "decimal" },
        { label: "Longitude", name: "longitude", type: "text", inputMode: "decimal" },
        { label: "Admin Username", name: "username", type: "text" },
        { label: "Admin Password", name: "adminPassword", type: "password" },
      ].map(({ label, name, type, inputMode }) => (
        <div key={name}>
          <label htmlFor={name} className="block font-medium text-gray-700 mb-1">
            {label}
          </label>
          <input
            id={name}
            name={name}
            type={type}
            inputMode={inputMode}
            value={formData[name]}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Register
      </button>
    </form>
  );
}
