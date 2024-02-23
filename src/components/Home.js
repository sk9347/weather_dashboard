import React, { useState, useEffect } from "react";
import "./home.css";

const WeatherDashboard = () => {
  // State variables for managing city input, weather data, forecast data, loading state, and errors
  const [city, setCity] = useState(""); // City input value
  const [weatherData, setWeatherData] = useState(null); // Current weather data
  const [forecastData, setForecastData] = useState(null); // Forecast data
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch weather data for the current location when the component mounts
    fetchCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to fetch weather data for the current location using geolocation
  const fetchCurrentLocation = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
        fetchForecastData(latitude, longitude);
      },
      (error) => {
        setError("Failed to get current location");
        setIsLoading(false);
      }
    );
  };

  // Function to fetch weather data based on latitude and longitude
  const fetchWeatherData = (latitude, longitude) => {
    // Constructing the API URL for fetching weather data
    const API_KEY = "ccbd99297a4de0687d0b9087f218d0b9";
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

    // Fetching weather data from the API
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        return response.json();
      })
      .then((data) => {
        setWeatherData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  };

  // Function to fetch forecast data based on latitude and longitude
  const fetchForecastData = (latitude, longitude) => {
    // Constructing the API URL for fetching forecast data
    const API_KEY = "ccbd99297a4de0687d0b9087f218d0b9";
    const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

    // Fetching forecast data from the API
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch forecast data");
        }
        return response.json();
      })
      .then((data) => {
        setForecastData(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // Function to handle city search
  const handleSearch = () => {
    if (city.trim() !== "") {
      setError(null);
      setWeatherData(null);
      setForecastData(null);
      fetchWeatherDataByCity();
      fetchForecastDataByCity();
    } else {
      setError("Please enter a city name");
    }
  };

  // Function to fetch weather data by city name
  const fetchWeatherDataByCity = () => {
    setIsLoading(true);
    // Constructing the API URL for fetching weather data by city name
    const API_KEY = "ccbd99297a4de0687d0b9087f218d0b9";
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    // Fetching weather data from the API
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        return response.json();
      })
      .then((data) => {
        setWeatherData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  };

  // Function to fetch forecast data by city name
  const fetchForecastDataByCity = () => {
    // Constructing the API URL for fetching forecast data by city name
    const API_KEY = "ccbd99297a4de0687d0b9087f218d0b9";
    const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    // Fetching forecast data from the API
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch forecast data");
        }
        return response.json();
      })
      .then((data) => {
        setForecastData(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // Function to get the day of the week from a timestamp
  const getDayOfWeek = (timestamp) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(timestamp * 1000);
    return days[date.getDay()];
  };

  // Function to get unique days from forecast data
  const getUniqueDays = () => {
    if (!forecastData || !forecastData.list) return [];
    const uniqueDays = {};
    forecastData.list.forEach((item) => {
      const day = getDayOfWeek(item.dt);
      uniqueDays[day] = item;
    });
    return Object.values(uniqueDays);
  };

  // Function to get the current day and time
  const getCurrentDay = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date();
    const dayOfWeek = days[date.getDay()];
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${dayOfWeek}, ${hours}:${minutes}`;
  };

  // Logging weather data for debugging purposes
  console.log(weatherData);

  return (
    <div className="weather-dashboard">
      <div className="search-container">
        {/* Display loading message if data is being loaded */}
        {isLoading && <p className="loading-message">Loading...</p>}
        {/* Display error message if there's an error */}
        {error && <p className="error-message">Error: {error}</p>}
        {/* Display weather data if available */}
        {weatherData && (
          <div className="current-weather">
            {/* Weather search input */}
            <h1 className="dashboard-heading">Weather Dashboard</h1>
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="city-input"
            />
            {/* Button to trigger city search */}
            <button onClick={handleSearch} className="search-button">
              Search
            </button>

            {/* Display current weather information */}
            <h1 className="section-heading">Current weather</h1>
            <img
              src={require(`../images/${weatherData.weather[0].description}.png`)}
              width={"30%"}
              height={"30%"}
              alt="des"
            ></img>
            <h2 className="weather-info">
              <img
                src={require("../images/location.png")}
                width={"10%"}
                height={"5%"}
                alt="lacation"
              ></img>
              City: {weatherData.name}
            </h2>
            <p className="weather-info">
              Temperature: {weatherData.main.temp}°C{" "}
              <img
                src={require("../images/temparature.png")}
                width={"6%"}
                alt="remparature"
              ></img>
            </p>
            <p className="weather-info">
              Description: {weatherData.weather[0].description}
            </p>
            {/* Display humidity, wind, and pressure */}
            <div className="weather-contain">
              <div>
                <p style={{ display: "inline-block" }}>
                  Humidity: {weatherData.main.humidity}{" "}
                </p>
                <img
                  src={require("../images/humidity.png")}
                  width={"15%"}
                  height={"35%"}
                  alt="humidity"
                ></img>
              </div>
              <div>
                <p style={{ display: "inline-block" }}>
                  Wind: {weatherData.wind.speed}{" "}
                </p>
                <img
                  src={require("../images/wind.png")}
                  width={"15%"}
                  height={"35%"}
                  alt="wind"
                ></img>
              </div>
              <div>
                <p style={{ display: "inline-block" }}>
                  Pressure: {weatherData.main.pressure}{" "}
                </p>
                <img
                  src={require("../images/air.png")}
                  width={"15%"}
                  height={"40%"}
                  alt="air"
                ></img>
              </div>
            </div>
            {/* Display current day and time */}
            <p className="weather-info">Time: {getCurrentDay()}</p>
          </div>
        )}
      </div>

      {/* Display forecast data if available */}
      {forecastData && (
        <div className="forecastData">
          <h2 className="section-heading">FORECAST</h2>
          <div className="forecast-container">
            {/* Map through unique forecast days and display forecast items */}
            {getUniqueDays().map((item, index) => (
              <div key={index} className="forecast-item">
                <img
                  src={require(`../images/${item.weather[0].description}.png`)}
                  alt={item.weather[0].description}
                  width={"30%"}
                  height={"30%"}
                ></img>
                {/* Display day, temperature, and description */}
                <p>{getDayOfWeek(item.dt)}</p>
                <p>Temperature: {item.main.temp}°C</p>
                <p>Description: {item.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;
