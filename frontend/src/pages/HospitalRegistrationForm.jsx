import React, { useState } from 'react';

const HospitalRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contact: '',
    latitude: '',
    longitude: '',
    username: '',
  password: ''
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
      const response = await fetch('http://localhost:8080/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage({ type: 'success', content: 'Registration successful!' });
        setFormData({
          name: '',
          location: '',
          contact: '',
          latitude: '',
          longitude: '',
          username: '',
        password: ''
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
        {[
          { label: 'Hospital Name', name: 'name', type: 'text' },
          { label: 'Location', name: 'location', type: 'text' },
          { label: 'Contact Number', name: 'contact', type: 'tel' },
          { label: 'Latitude', name: 'latitude', type: 'text' },
          { label: 'Longitude', name: 'longitude', type: 'text' },
          { label: 'Admin Username', name: 'username', type: 'text' },
          { label: 'Admin Password', name: 'adminPassword', type: 'password' }
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label htmlFor={name} className="block font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
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
    </div>
  );
};

export default HospitalRegistrationForm;
