const GEOCODING_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_BASE_URL = "https://api.open-meteo.com/v1/forecast";

function weatherCodeToCondition(code) {
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Variable weather";
}

function toNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function dayLabel(dateValue, index) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return index === 0 ? "Today" : `Day ${index + 1}`;
  }

  if (index === 0) return "Today";
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function dateLabel(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

async function fetchGeocoding(city) {
  const normalizedQuery = city.toLowerCase();
  const aliases = {
    // Historical/alternate city names
    bangalore: "Bengaluru",
    bombay: "Mumbai",
    calcutta: "Kolkata",
    madras: "Chennai",
    poona: "Pune",
    vizag: "Visakhapatnam",
    cochin: "Kochi",
    trivandrum: "Thiruvananthapuram",
    thiruvananthapuram: "Thiruvananthapuram",
    // Major cities and districts
    tirupati: "Tirupati",
    trichy: "Tiruchirapalli",
    hyderabad: "Hyderabad",
    jaipur: "Jaipur",
    delhi: "New Delhi",
    "new delhi": "New Delhi",
    lucknow: "Lucknow",
    kanpur: "Kanpur",
    nagpur: "Nagpur",
    indore: "Indore",
    bhopal: "Bhopal",
    coimbatore: "Coimbatore",
    madurai: "Madurai",
    salem: "Salem",
    varanasi: "Varanasi",
    ahmedabad: "Ahmedabad",
    vadodara: "Vadodara",
    surat: "Surat",
    rajkot: "Rajkot",
    jodhpur: "Jodhpur",
    agra: "Agra",
    guwahati: "Guwahati",
    srinagar: "Srinagar",
    // State names → State capital/major city
    maharashtra: "Mumbai",
    "tamil nadu": "Chennai",
    karnataka: "Bengaluru",
    telangana: "Hyderabad",
    "andhra pradesh": "Visakhapatnam",
    gujarat: "Ahmedabad",
    "madhya pradesh": "Bhopal",
    "uttar pradesh": "Lucknow",
    rajasthan: "Jaipur",
    punjab: "Chandigarh",
    haryana: "Gurugram",
    bihar: "Patna",
    jharkhand: "Ranchi",
    odisha: "Bhubaneswar",
    assam: "Guwahati",
    "jammu and kashmir": "Srinagar",
    "j&k": "Srinagar",
    "himachal pradesh": "Shimla",
    uttarakhand: "Dehradun",
    goa: "Panaji",
    kerala: "Kochi",
    "west bengal": "Kolkata",
  };
  const searchTerm = aliases[normalizedQuery] ?? city;

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(searchTerm)}&count=10&language=en&format=json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch city coordinates");
  }

  const data = await response.json();
  const candidates = Array.isArray(data?.results) ? data.results : [];
  const ranked = candidates
    .map((item) => {
      const name = String(item?.name ?? "").toLowerCase();
      const exactName = name === normalizedQuery ? 1 : 0;
      const startsWithName = !exactName && name.startsWith(normalizedQuery) ? 1 : 0;
      const population = Number(item?.population ?? 0);

      return {
        item,
        score: exactName * 1000000000 + startsWithName * 500000000 + population,
      };
    })
    .sort((a, b) => b.score - a.score);

  const location = ranked[0]?.item;
  if (!location) {
    return null;
  }

  return {
    name: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone,
  };
}

async function fetchForecast(location) {
  const query = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    timezone: "auto",
    forecast_days: "7",
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,surface_pressure,wind_speed_10m,precipitation_probability,weather_code,is_day",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset",
  });

  const response = await fetch(`${FORECAST_BASE_URL}?${query.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch weather forecast");
  }

  return response.json();
}

function normalizeWeatherPayload(location, weatherData) {
  const current = weatherData?.current ?? {};
  const daily = weatherData?.daily ?? {};

  const times = daily.time ?? [];
  const weatherCodes = daily.weather_code ?? [];
  const highs = daily.temperature_2m_max ?? [];
  const lows = daily.temperature_2m_min ?? [];
  const rainProbabilities = daily.precipitation_probability_max ?? [];
  const uvIndexes = daily.uv_index_max ?? [];
  const sunrises = daily.sunrise ?? [];
  const sunsets = daily.sunset ?? [];

  const normalizedDaily = times.map((timeValue, index) => {
    const code = toNumber(weatherCodes[index]);
    return {
      day: dayLabel(timeValue, index),
      date: dateLabel(timeValue),
      condition: weatherCodeToCondition(code),
      weatherCode: code,
      high: Math.round(toNumber(highs[index])),
      low: Math.round(toNumber(lows[index])),
      rainProbability: Math.round(toNumber(rainProbabilities[index])),
      uvIndexMax: Math.round(toNumber(uvIndexes[index])),
      sunrise: sunrises[index] ?? "",
      sunset: sunsets[index] ?? "",
    };
  });

  const currentCode = toNumber(current.weather_code);

  return {
    city: {
      name: location.name,
      country: location.country,
      latitude: toNumber(location.latitude),
      longitude: toNumber(location.longitude),
      timezone: location.timezone,
    },
    current: {
      condition: weatherCodeToCondition(currentCode),
      weatherCode: currentCode,
      isDay: Boolean(current.is_day),
      temperature: Math.round(toNumber(current.temperature_2m)),
      apparentTemperature: Math.round(toNumber(current.apparent_temperature)),
      humidity: Math.round(toNumber(current.relative_humidity_2m)),
      pressure: Math.round(toNumber(current.surface_pressure)),
      windSpeed: Math.round(toNumber(current.wind_speed_10m)),
      precipitationProbability: Math.round(toNumber(current.precipitation_probability)),
      sunrise: normalizedDaily[0]?.sunrise ?? "",
      sunset: normalizedDaily[0]?.sunset ?? "",
      uvIndexMax: normalizedDaily[0]?.uvIndexMax ?? 0,
    },
    daily: normalizedDaily,
  };
}

export const handleWeather = async (req, res) => {
  try {
    const city = String(req.query.city ?? "").trim();

    if (!city) {
      res.status(400).json({ message: "Query parameter 'city' is required." });
      return;
    }

    const location = await fetchGeocoding(city);

    if (!location) {
      res.status(404).json({ message: "City not found. Try a different city name." });
      return;
    }

    const forecast = await fetchForecast(location);
    const payload = normalizeWeatherPayload(location, forecast);

    res.status(200).json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected weather service error";
    res.status(500).json({ message });
  }
};
