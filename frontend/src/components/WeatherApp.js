import React from "react";

function WeatherApp({ weather, forecast }) {
  const getWeatherIcon = (iconCode) => {
    if (!iconCode) return "☀️";
    if (iconCode.includes("01")) return "☀️";
    if (iconCode.includes("02") || iconCode.includes("03") || iconCode.includes("04")) return "☁️";
    if (iconCode.includes("09") || iconCode.includes("10")) return "🌧️";
    if (iconCode.includes("11")) return "⛈️";
    if (iconCode.includes("13")) return "❄️";
    if (iconCode.includes("50")) return "🌫️";
    return "☀️";
  };

  const getForecastForDay = (forecastList) => {
    const items = Array.isArray(forecastList)
      ? forecastList
      : forecastList?.list || [];

    if (!items.length) return [];

    const daily = {};

    items.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      const tempMin = item.main?.temp_min ?? item.temp;
      const tempMax = item.main?.temp_max ?? item.temp;
      const icon = item.weather?.[0]?.icon ?? item.icon;
      const desc = item.weather?.[0]?.description ?? item.description;

      if (!daily[date]) {
        daily[date] = {
          min: tempMin,
          max: tempMax,
          icon,
          desc,
        };
      } else {
        daily[date].min = Math.min(daily[date].min, tempMin);
        daily[date].max = Math.max(daily[date].max, tempMax);
      }
    });

    return Object.entries(daily)
      .slice(0, 5)
      .map(([date, data]) => ({
        date,
        ...data,
      }));
  };

  const dayForecast = getForecastForDay(forecast);

  return (
    <div>
      <div style={styles.card}>
        <h2 style={styles.location}>
          {weather.location || weather.name || "Current Weather"}
        </h2>

        <div style={styles.icon}>
          {getWeatherIcon(weather.icon || weather.weather?.[0]?.icon)}
        </div>

        <div style={styles.temp}>
          {Math.round(weather.currentTemp ?? weather.main?.temp ?? 0)}°C
        </div>

        {weather.feelsLike != null && (
          <div style={styles.feelsLike}>
            Feels like {Math.round(weather.feelsLike)}°C
          </div>
        )}

        <div style={styles.description}>
          {weather.description || weather.weather?.[0]?.description}
        </div>

        <div style={styles.details}>
          <span>
            Humidity: {weather.humidity ?? weather.main?.humidity}%
          </span>

          <span>
            Wind: {weather.windSpeed ?? weather.wind?.speed} m/s
          </span>
        </div>
      </div>

      {dayForecast.length > 0 && (
        <div style={styles.forecastSection}>
          <h3 style={styles.forecastTitle}>5-Day Forecast</h3>

          <div style={styles.forecastGrid}>
            {dayForecast.map((day, index) => (
              <div key={index} style={styles.forecastCard}>
                <div style={styles.day}>{day.date}</div>

                <div style={styles.icon}>
                  {getWeatherIcon(day.icon)}
                </div>

                <div style={styles.highLow}>
                  {Math.round(day.max)}° / {Math.round(day.min)}°
                </div>

                <div style={styles.desc}>{day.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {weather.mapData && Object.keys(weather.mapData).length > 0 && (
        <div style={styles.mapSection}>
          <h3>Map Information</h3>

          <p>
            <strong>Address:</strong>{" "}
            {weather.mapData.formattedAddress ||
              weather.mapData.formatted_address}
          </p>
        </div>
      )}

      {weather.videos?.length > 0 && (
        <div style={styles.videosSection}>
          <h3>Related Videos</h3>

          <div style={styles.videoGrid}>
            {weather.videos.map((video, index) => (
              <a
                key={index}
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.videoLink}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  style={styles.thumbnail}
                />

                <div style={styles.videoTitle}>
                  {video.title}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    color: "#fff",
    borderRadius: "15px",
    padding: "30px",
    textAlign: "center",
    marginBottom: "20px",
  },

  location: {
    marginBottom: "10px",
  },

  icon: {
    fontSize: "60px",
  },

  temp: {
    fontSize: "55px",
    fontWeight: "bold",
  },

  feelsLike: {
    marginTop: "5px",
  },

  description: {
    marginTop: "10px",
    fontSize: "20px",
    textTransform: "capitalize",
  },

  details: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
    flexWrap: "wrap",
  },

  forecastSection: {
    marginTop: "30px",
  },

  forecastTitle: {
    marginBottom: "15px",
  },

  forecastGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
    gap: "15px",
  },

  forecastCard: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    textAlign: "center",
  },

  day: {
    fontWeight: "bold",
  },

  highLow: {
    margin: "8px 0",
    fontWeight: "bold",
  },

  desc: {
    textTransform: "capitalize",
  },

  mapSection: {
    marginTop: "25px",
  },

  videosSection: {
    marginTop: "30px",
  },

  videoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "15px",
  },

  videoLink: {
    textDecoration: "none",
    color: "#000",
  },

  thumbnail: {
    width: "100%",
    borderRadius: "8px",
  },

  videoTitle: {
    marginTop: "8px",
    fontWeight: "bold",
  },
};

export default WeatherApp;