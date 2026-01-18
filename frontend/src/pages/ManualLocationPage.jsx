import { useState } from "react";
import { useParams } from "react-router-dom";

const PRESET_LOCATIONS = [
  {
    name: "Bangalore",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    name: "Mumbai",
    latitude: 19.0760,
    longitude: 72.8777,
  },
  {
    name: "Delhi",
    latitude: 28.6139,
    longitude: 77.2090,
  },
];

const ManualLocationPage = () => {
  const { animalName } = useParams();

  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Handle dropdown selection
  const handleCitySelect = (e) => {
    const selected = PRESET_LOCATIONS.find(
      (loc) => loc.name === e.target.value
    );

    if (selected) {
      setCity(selected.name);
      setLatitude(selected.latitude);
      setLongitude(selected.longitude);
    }
  };

  // Handle manual typing (no lat/long yet)
  const handleManualInput = (e) => {
    setCity(e.target.value);
    setLatitude(null);
    setLongitude(null);
  };

  // Final submit
  const handleSearch = () => {
    if (!city) return;

    const payload = {
      animalName: decodeURIComponent(animalName),
      city,
      latitude,
      longitude,
    };

    console.log("Searching nearest hospitals with:", payload);

    /*
      🔽 CALL YOUR BACKEND HERE 🔽
      Example:
      axios.post("/api/hospitals/nearest", payload)
    */

    alert(
      latitude && longitude
        ? `Finding nearest hospitals for ${animalName} in ${city} (${latitude}, ${longitude})`
        : `Finding hospitals for ${animalName} in ${city}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto pt-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Enter Your Location for {decodeURIComponent(animalName)} Antivenom
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
          {/* Dropdown Selection */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Select City (Recommended)
            </label>
            <select
              onChange={handleCitySelect}
              defaultValue=""
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              <option value="" disabled>
                Select a city
              </option>
              {PRESET_LOCATIONS.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Manual Input */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Or Enter City / Area Manually
            </label>
            <input
              type="text"
              value={city}
              onChange={handleManualInput}
              placeholder="e.g., Bangalore, Mysore, Tumkur"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Show coordinates if available */}
          {latitude && longitude && (
            <div className="text-sm text-green-600 dark:text-green-400">
              Using coordinates: {latitude}, {longitude}
            </div>
          )}

          <button
            onClick={handleSearch}
            disabled={!city.trim()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            Find Nearest Hospitals
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualLocationPage;
