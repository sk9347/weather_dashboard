import React, { useState, useEffect } from "react";
import "./home.css";

const WeatherDashboard = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch weather data for the current location when the component mounts
    fetchCurrentLocation();
  },[]);

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

  const fetchWeatherData = (latitude, longitude) => {
    const API_KEY = "ccbd99297a4de0687d0b9087f218d0b9";
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

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

  const fetchForecastData = (latitude, longitude) => {
    const API_KEY = "ccbd99297a4de0687d0b9087f218d0b9";
    const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

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

  const fetchWeatherDataByCity = () => {
    setIsLoading(true);
    const API_KEY = "ccbd99297a4de0687d0b9087f218d0b9";
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

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

  const fetchForecastDataByCity = () => {
    const API_KEY = "ccbd99297a4de0687d0b9087f218d0b9";
    const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

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

  const getUniqueDays = () => {
    if (!forecastData || !forecastData.list) return [];
    const uniqueDays = {};
    forecastData.list.forEach((item) => {
      const day = getDayOfWeek(item.dt);
      uniqueDays[day] = item;
    });
    return Object.values(uniqueDays);
  };
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

  console.log(weatherData);
  return (
    <div className="weather-dashboard">
      <div className="search-container">
        {isLoading && <p className="loading-message">Loading...</p>}
        {error && <p className="error-message">Error: {error}</p>}
        {weatherData && (
          <div className="current-weather">
            <h1 className="dashboard-heading">Weather Dashboard</h1>
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="city-input"
            />
            <button onClick={handleSearch} className="search-button">
              Search
            </button>

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
            <div className="weather-contain">
              <div>
                <p style={{ display: "inline-block" }}>
                  Hummidity: {weatherData.main.humidity}{" "}
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
                  Presure: {weatherData.main.pressure}{" "}
                </p>
                <img
                  src={require("../images/air.png")}
                  width={"15%"}
                  height={"40%"}
                  alt="air"
                ></img>
              </div>
            </div>
            <p className="weather-info">Time: {getCurrentDay()}</p>

            {/* Display other weather data properties */}
          </div>
        )}
      </div>

      {forecastData && (
        <div className="forecastData">
          <h2 className="section-heading">FORECAST</h2>
          <div className="forecast-container">
            {getUniqueDays().map((item, index) => (
              <div key={index} className="forecast-item">
                <img
                  src={require(`../images/${item.weather[0].description}.png`)}
                  alt={item.weather[0].description}
                  width={"30%"}
                  height={"30%"}
                ></img>

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
