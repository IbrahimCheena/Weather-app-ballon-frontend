import React, { useState, useEffect } from "react";

function App() {
    const [weather, setWeather] = useState(null);
    const [balloons, setBalloons] = useState([]); // Default to empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showHistorical, setShowHistorical] = useState(false); // Toggle state for historical data

    const fetchData = async () => {
        try {
            const response = await fetch("https://weather-balloon-app.onrender.com/");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setWeather(data.weather);
            setBalloons(data.balloons || []); // Ensure balloons is always an array
            setLoading(false);
        } catch (err) {
            console.error("Fetch error:", err); // Debugging
            setError("Failed to fetch data: " + err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleHistoricalData = () => {
        console.log("Toggling historical data. Current state:", showHistorical);
        setShowHistorical(!showHistorical);
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-purple-50">
                <p className="text-center text-xl text-red-500">
                    {error}{" "}
                    <button
                        onClick={fetchData}
                        className="ml-4 text-blue-500 underline hover:text-blue-600"
                    >
                        Retry
                    </button>
                </p>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                    Weather & Balloon Data
                </h1>

                {/* Refresh Button */}
                <div className="text-center mb-8">
                    <button
                        onClick={fetchData}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300 shadow-lg hover:shadow-xl"
                    >
                        Refresh Data
                    </button>
                </div>

                {/* Weather Section */}
                <div className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Weather in Palo Alto
                    </h2>
                    {weather && weather.currentConditions ? (
                        <div className="mt-4 bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center space-x-4">
                                <span className="text-4xl">🌤️</span>
                                <div>
                                    <p className="text-lg">
                                        <strong>Temperature:</strong> {weather.currentConditions.temp}°F
                                    </p>
                                    <p className="text-lg">
                                        <strong>Condition:</strong> {weather.currentConditions.conditions}
                                    </p>
                                    <p className="text-lg">
                                        <strong>Humidity:</strong> {weather.currentConditions.humidity}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-4 text-gray-500">No weather data available</p>
                    )}
                </div>

                {/* Balloon Data Section */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Balloon Data</h2>
                    {balloons.length > 0 ? (
                        <ul className="space-y-4 mt-4 bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                            {balloons.map((balloon, index) => (
                                <li
                                    key={index}
                                    className="text-gray-600 hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200"
                                >
                                    <strong>ID:</strong> {index + 1} |{" "}
                                    <strong>Lat:</strong> {balloon[0] !== null ? balloon[0] : "N/A"} |{" "}
                                    <strong>Lon:</strong> {balloon[1] !== null ? balloon[1] : "N/A"} |{" "}
                                    <strong>Altitude:</strong> {balloon[2] !== null ? balloon[2] : "N/A"}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-4 text-gray-500">No balloon data available</p>
                    )}
                </div>

                {/* Toggle Button for Historical Data */}
                <div className="text-center mt-8">
                    <button
                        onClick={toggleHistoricalData}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300 shadow-lg hover:shadow-xl"
                    >
                        {showHistorical ? "Hide Historical Data" : "Show Historical Data"}
                    </button>
                </div>

                {/* Historical Balloon Data Section */}
                {showHistorical && (
                    <div className="mt-10">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Historical Balloon Data
                        </h2>
                        {balloons && balloons.historical_balloons && balloons.historical_balloons.length > 0 ? (
                            <ul className="space-y-4 mt-4 bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                {balloons.historical_balloons.map((balloon, index) => (
                                    <li
                                        key={index}
                                        className="text-gray-600 hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200"
                                    >
                                        <strong>ID:</strong> {balloon.id || "N/A"} |{" "}
                                        <strong>Lat:</strong> {balloon.lat || "N/A"} |{" "}
                                        <strong>Lon:</strong> {balloon.lon || "N/A"} |{" "}
                                        <strong>Altitude:</strong> {balloon.alt || "N/A"} |{" "}
                                        <strong>Hours Ago:</strong> {balloon.hours_ago || "N/A"}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-4 text-gray-500">No historical balloon data available</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;