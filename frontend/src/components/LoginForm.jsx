import { useState } from "react";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState({ type: "", content: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    return formData.username.trim() !== "" && formData.password.trim() !== "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ type: "error", content: "Please enter both username and password." });
      return;
    }

    try {
     const response = await fetch("http://localhost:8080/api/admin/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    username: formData.username,
    password: formData.password,
  }),
});

      const text = await response.text();

      if (response.ok) {
        setMessage({ type: "success", content: text || "Login successful!" });
        // Optionally navigate to dashboard:
        window.location.href = "/admin/dashboard";
      } else {
        setMessage({ type: "error", content: text || "Login failed." });
      }
    } catch (error) {
      setMessage({
        type: "error",
        content: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message.content && (
        <div
          className={`p-3 rounded text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.content}
        </div>
      )}

      <div>
        <label htmlFor="username" className="block font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label htmlFor="password" className="block font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Sign In
      </button>
    </form>
  );
}
