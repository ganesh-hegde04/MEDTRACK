import React, { useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const HospitalRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contact: '',
    latitude: '',
    longitude: '',
    email: '',
    username: '',
    adminPassword: ''
  });

  const [message, setMessage] = useState({ type: '', content: '' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    return Object.values(formData).every(field => field.trim() !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ type: 'error', content: 'Please fill in all fields.' });
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };

      const response = await fetch(`${BACKEND_URL}/api/admin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        setMessage({ type: 'success', content: 'Registration successful!' });
        setFormData({
          name: '',
          location: '',
          contact: '',
          latitude: '',
          longitude: '',
          email: '',
          username: '',
          adminPassword: ''
        });
      } else {
        const err = await response.json();
        setMessage({ type: 'error', content: err.message || 'Registration failed.' });
      }
    } catch (error) {
      setMessage({ type: 'error', content: 'An error occurred. Please try again later.' });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Hospital Admin Registration</h2>

      {message.content && (
        <div
          className={`mb-4 px-4 py-2 rounded text-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.content}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hospital Name */}
        <div>
          <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
            Hospital Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Contact Number */}
        <div>
          <label htmlFor="contact" className="block font-medium text-gray-700 mb-1">
            Contact Number
          </label>
          <input
            id="contact"
            name="contact"
            type="tel"
            value={formData.contact}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Latitude */}
        <div>
          <label htmlFor="latitude" className="block font-medium text-gray-700 mb-1">
            Latitude
          </label>
          <input
            id="latitude"
            name="latitude"
            type="text"
            value={formData.latitude}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Longitude */}
        <div>
          <label htmlFor="longitude" className="block font-medium text-gray-700 mb-1">
            Longitude
          </label>
          <input
            id="longitude"
            name="longitude"
            type="text"
            value={formData.longitude}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Admin Email */}
        <div>
          <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
            Admin Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Admin Username */}
        <div>
          <label htmlFor="username" className="block font-medium text-gray-700 mb-1">
            Admin Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Admin Password */}
        <div>
          <label htmlFor="adminPassword" className="block font-medium text-gray-700 mb-1">
            Admin Password
          </label>
          <input
            id="adminPassword"
            name="adminPassword"
            type="password"
            value={formData.adminPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default HospitalRegistrationForm;