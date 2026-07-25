import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  ChevronDown,
  CloudDrizzle,
  CloudFog,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  Github,
  Gauge,
  Globe2,
  Leaf,
  Loader2,
  MapPin,
  Menu,
  Navigation,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Umbrella,
  Wind,
  Zap,
} from "lucide-react";

const popularCities = ["San Francisco", "London", "Tokyo", "Delhi", "Berlin", "Nairobi"];

function weatherVisual(code, isDay = true) {
  if (code === 0) {
    return isDay
      ? { icon: Sun, color: "text-orange-500" }
      : { icon: CloudSun, color: "text-indigo-300" };
  }

  if ([1, 2, 3].includes(code)) return { icon: CloudSun, color: "text-amber-500" };
  if ([45, 48].includes(code)) return { icon: CloudFog, color: "text-slate-500" };
  if ([51, 53, 55, 56, 57].includes(code)) return { icon: CloudDrizzle, color: "text-cyan-500" };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { icon: CloudRain, color: "text-sky-500" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: CloudSnow, color: "text-blue-500" };
  if ([95, 96, 99].includes(code)) return { icon: Zap, color: "text-violet-500" };
  return { icon: CloudSun, color: "text-amber-500" };
}

function percentBar(value) {
  const safe = Math.max(0, Math.min(100, Number(value) || 0));
  return `${safe}%`;
}

function uvLabel(uvIndex) {
  if (uvIndex <= 2) return "Low";
  if (uvIndex <= 5) return "Moderate";
  if (uvIndex <= 7) return "High";
  if (uvIndex <= 10) return "Very high";
  return "Extreme";
}

function formatTime(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function buildHighlights(weather) {
  const current = weather.current;
  return [
    { label: "Humidity", value: String(current.humidity), unit: "%", helper: current.humidity >= 70 ? "Humid" : "Comfortable", icon: Droplets, tone: "text-sky-500", barColor: "bg-sky-400", barWidth: percentBar(current.humidity) },
    { label: "Wind speed", value: String(current.windSpeed), unit: "km/h", helper: current.windSpeed >= 26 ? "Strong wind" : "Gentle breeze", icon: Wind, tone: "text-indigo-500", barColor: "bg-indigo-400", barWidth: percentBar((current.windSpeed / 60) * 100) },
    { label: "Pressure", value: String(current.pressure), unit: "hPa", helper: "Sea-level pressure", icon: Gauge, tone: "text-violet-500", barColor: "bg-violet-400", barWidth: percentBar(((current.pressure - 950) / 100) * 100) },
    { label: "Rain probability", value: String(current.precipitationProbability), unit: "%", helper: current.precipitationProbability >= 50 ? "Likely rain" : "Low chance", icon: Umbrella, tone: "text-cyan-500", barColor: "bg-cyan-400", barWidth: percentBar(current.precipitationProbability) },
    { label: "UV index", value: String(current.uvIndexMax), unit: uvLabel(current.uvIndexMax), helper: "Sun exposure", icon: Sun, tone: "text-amber-500", barColor: "bg-amber-400", barWidth: percentBar((current.uvIndexMax / 11) * 100) },
    { label: "Feels like", value: String(current.apparentTemperature), unit: "°C", helper: current.apparentTemperature > current.temperature ? "Warmer feel" : "Cooler feel", icon: Thermometer, tone: "text-rose-500", barColor: "bg-rose-400", barWidth: percentBar(((current.apparentTemperature + 10) / 60) * 100) },
  ];
}

function buildRecommendations(weather) {
  const { current } = weather;

  return [
    {
      title: current.windSpeed > 26 ? "Secure outdoor plans" : "Good for outdoor activities",
      detail:
        current.windSpeed > 26
          ? "Winds are strong today. Prefer stable routes and avoid light outdoor setups."
          : "Wind is manageable, making this a good day for walks and commuting.",
      icon: Leaf,
      tone: "bg-emerald-50 text-emerald-600",
      label: "OUTDOORS",
    },
    {
      title: current.precipitationProbability >= 50 ? "Carry rain protection" : "Low rain risk",
      detail:
        current.precipitationProbability >= 50
          ? "Rain chances are elevated. Keep an umbrella or rain jacket nearby."
          : "Rain chance is limited for now, but check updates before late travel.",
      icon: Umbrella,
      tone: "bg-blue-50 text-blue-600",
      label: "PREPARE",
    },
    {
      title: current.uvIndexMax >= 6 ? "Sun safety is important" : "UV exposure is manageable",
      detail:
        current.uvIndexMax >= 6
          ? "Use sunscreen and sunglasses during peak daylight hours."
          : "Standard daylight precautions are enough for most routines.",
      icon: ShieldCheck,
      tone: "bg-amber-50 text-amber-600",
      label: "WELLNESS",
    },
  ];
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 shadow-lg shadow-blue-300/40 flex items-center justify-center group hover:shadow-blue-400/60 transition-shadow">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
        <CloudSun size={24} className="text-white drop-shadow-md" strokeWidth={2.3} />
      </div>
      <div className="flex flex-col -gap-1">
        <span className="text-[15px] font-bold tracking-tight text-slate-900 leading-none">
          Weather<span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Intelligence</span>
        </span>
        <span className="text-[10px] font-medium text-slate-400 tracking-widest uppercase">Real-time Forecast</span>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <header className="relative z-10 mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 lg:px-8">
      <Brand />
      <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
        <a className="nav-link active" href="#overview">Overview</a>
        <a className="nav-link" href="#forecast">Forecast</a>
        <a className="nav-link" href="#insights">Insights</a>
      </nav>
      <div className="flex items-center gap-3">
        <button aria-label="Notifications" className="hidden h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-white hover:text-slate-900 sm:grid">
          <Bell size={18} />
        </button>
        <button className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600 sm:flex">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">JD</span>
          Jordan <ChevronDown size={15} />
        </button>
        <button aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 md:hidden">
          <Menu size={19} />
        </button>
      </div>
    </header>
  );
}

function SearchBar({ onSearch, compact = false }) {
  const [value, setValue] = useState("");
  const submit = (event) => {
    event.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };
  return (
    <form onSubmit={submit} className={`flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_12px_35px_rgba(15,23,42,0.08)] ${compact ? "w-full max-w-[400px]" : "mx-auto w-full max-w-[590px]"}`}>
      <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
        <Search size={18} className="shrink-0 text-slate-400" />
        <input
          aria-label="Search for a city"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="w-full bg-transparent py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          placeholder="Search for a city..."
        />
        <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 sm:block">⌘ K</kbd>
      </div>
      <button type="submit" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 active:scale-[.98]">
        Search
      </button>
    </form>
  );
}

function Hero({ onSearch }) {
  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-12 text-center lg:px-8 lg:pb-16 lg:pt-20">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <div className="relative mx-auto max-w-3xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.14em] text-blue-600 shadow-sm">
          <Sparkles size={13} /> Smarter weather, better days
        </div>
        <h1 className="mx-auto max-w-2xl text-4xl font-extrabold tracking-[-.045em] text-slate-950 sm:text-5xl lg:text-[64px] lg:leading-[1.05]">
          Weather, <span className="hero-gradient">intelligently</span> understood.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
          Plan your day with confidence. Live weather data, a 7-day forecast, and practical recommendations in one place.
        </p>
        <div className="mt-8">
          <SearchBar onSearch={onSearch} />
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span>Popular:</span>
          {popularCities.map((city) => (
            <button
              onClick={() => onSearch(city)}
              key={city}
              className="rounded-full bg-white px-3 py-1.5 font-medium text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-blue-600"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function WeatherMetric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[.1] p-4 backdrop-blur-sm">
      <Icon size={17} className="text-blue-200" />
      <p className="mt-4 text-xs text-blue-200">{label}</p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  );
}

function CurrentWeather({ weather }) {
  const { city, current } = weather;
  const visual = weatherVisual(current.weatherCode, current.isDay);
  const Icon = visual.icon;

  return (
    <section id="overview" className="weather-panel relative overflow-hidden rounded-[28px] p-6 text-white shadow-[0_25px_70px_rgba(37,99,235,0.2)] sm:p-8">
      <div className="weather-sheen" />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-blue-100">
            <MapPin size={15} /> {city.name}, {city.country}
            <span className="mx-1 h-1 w-1 rounded-full bg-blue-200" /> {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
          <div className="mt-7 flex items-center gap-5">
            <Icon size={70} strokeWidth={1.4} className="text-sky-100 drop-shadow-lg" />
            <div>
              <div className="text-7xl font-light tracking-[-.08em] sm:text-8xl">{current.temperature}°</div>
              <div className="mt-1 text-sm font-medium text-blue-100">
                {current.condition} <span className="mx-1.5 opacity-60">•</span> Feels like {current.apparentTemperature}°
              </div>
            </div>
          </div>
          <div className="mt-8 flex gap-8 text-sm">
            <div>
              <p className="text-blue-200">Sunrise</p>
              <p className="mt-1 flex items-center gap-1.5 font-semibold"><Sunrise size={15} className="text-amber-200" /> {formatTime(current.sunrise)}</p>
            </div>
            <div>
              <p className="text-blue-200">Sunset</p>
              <p className="mt-1 flex items-center gap-1.5 font-semibold"><Sunset size={15} className="text-orange-200" /> {formatTime(current.sunset)}</p>
            </div>
          </div>
        </div>
        <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[420px] lg:grid-cols-2">
          <WeatherMetric icon={Thermometer} label="Feels like" value={`${current.apparentTemperature}°`} />
          <WeatherMetric icon={Droplets} label="Humidity" value={`${current.humidity}%`} />
          <WeatherMetric icon={Wind} label="Wind" value={`${current.windSpeed} km/h`} />
          <WeatherMetric icon={Gauge} label="Pressure" value={`${current.pressure} hPa`} />
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[.16em] text-blue-600">{eyebrow}</p>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
      </div>
      {action && (
        <button className="hidden items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700 sm:flex">
          {action}<ArrowUpRight size={15} />
        </button>
      )}
    </div>
  );
}

function Highlights({ weather }) {
  const highlights = useMemo(() => buildHighlights(weather), [weather]);

  return (
    <section>
      <SectionHeading eyebrow="At a glance" title="Today's highlights" action="View details" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {highlights.map(({ label, value, unit, helper, icon: Icon, tone, barColor, barWidth }) => (
          <div key={label} className="stat-card rounded-2xl border border-slate-200/80 bg-white p-4">
            <div className="flex items-center justify-between">
              <Icon size={18} className={tone} />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{helper}</span>
            </div>
            <p className="mt-5 text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">
              {value}<span className="ml-1 text-xs font-medium text-slate-400">{unit}</span>
            </p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${barColor}`} style={{ width: barWidth }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Forecast({ weather }) {
  return (
    <section id="forecast">
      <SectionHeading eyebrow="The week ahead" title="7-day forecast" action="Next 7 days" />
      <div className="forecast-scroll flex gap-3 overflow-x-auto pb-3">
        {weather.daily.map(({ day, date, weatherCode, high, low, rainProbability }, index) => {
          const visual = weatherVisual(weatherCode, true);
          const Icon = visual.icon;
          return (
          <div
            key={day}
            className={`forecast-card min-w-[126px] flex-1 rounded-2xl border p-4 ${index === 0 ? "border-blue-200 bg-blue-50/70 shadow-sm shadow-blue-100" : "border-slate-200/80 bg-white"}`}
          >
            <div className="flex items-center justify-between">
              <p className={`text-sm font-bold ${index === 0 ? "text-blue-700" : "text-slate-800"}`}>{day}</p>
              {index === 0 && <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Now</span>}
            </div>
            <p className="mt-1 text-[11px] text-slate-400">{date}</p>
            <Icon size={30} className={`my-5 ${visual.color}`} strokeWidth={1.6} />
            <div className="flex items-end gap-1">
              <span className="text-lg font-bold text-slate-900">{high}°</span>
              <span className="text-xs text-slate-400">{low}°</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-200/70 pt-3 text-[10px] font-medium text-slate-500">
              <span className="text-blue-500">{rainProbability}% rain</span>
              <span>{weather.current.windSpeed} km/h</span>
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}

function Recommendations({ weather }) {
  const recommendations = useMemo(() => buildRecommendations(weather), [weather]);

  return (
    <section id="insights">
      <SectionHeading eyebrow="Personalized for you" title="Smart recommendations" />
      <div className="grid gap-3 md:grid-cols-3">
        {recommendations.map(({ title, detail, icon: Icon, tone, label }) => (
          <div key={title} className="recommendation-card rounded-2xl border border-slate-200/80 bg-white p-5">
            <div className="flex items-start justify-between">
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>
                <Icon size={19} />
              </div>
              <span className="text-[10px] font-bold tracking-[.12em] text-slate-400">{label}</span>
            </div>
            <h3 className="mt-5 text-sm font-bold text-slate-900">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ErrorState({ onReset }) {
  return (
    <div className="mx-auto max-w-xl rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-500">
        <Globe2 size={30} />
      </div>
      <h2 className="mt-6 text-2xl font-bold text-slate-900">City not found</h2>
      <p className="mt-2 text-sm text-slate-500">We couldn't find that location. Try searching for another city.</p>
      <button onClick={onReset} className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
        Search again
      </button>
    </div>
  );
}

export default function Index() {
  const [weatherData, setWeatherData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("We couldn't find that location. Try searching for another city.");
  const [lastQuery, setLastQuery] = useState(popularCities[0]);

  const handleSearch = async (query) => {
    setStatus("loading");
    setErrorMessage("We couldn't find that location. Try searching for another city.");

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(query)}`);
      const payload = await response.json();

      if (!response.ok) {
        setErrorMessage(payload?.message || "Unable to fetch weather at the moment.");
        setStatus("error");
        return;
      }

      setWeatherData(payload);
      setLastQuery(query);
      setStatus("ready");
    } catch (_error) {
      setErrorMessage("Network issue while contacting weather service. Please retry.");
      setStatus("error");
    }
  };

  useEffect(() => {
    handleSearch(popularCities[0]);
  }, []);

  const hasWeather = status === "ready" && weatherData;

  return (
    <div className="min-h-screen bg-[#f7faff]">
      <Navbar />
      <main>
        <Hero onSearch={handleSearch} />
        <div className="mx-auto max-w-[1240px] space-y-12 px-5 pb-16 lg:px-8">
          {status === "loading" || status === "idle" ? (
            <div className="loading-panel flex min-h-[390px] flex-col items-center justify-center rounded-[28px] border border-slate-200 bg-white">
              <Loader2 className="animate-spin text-blue-600" size={30} />
              <p className="mt-4 text-sm font-medium text-slate-600">Loading weather data...</p>
              <p className="mt-1 text-xs text-slate-400">Finding the most accurate forecast</p>
            </div>
          ) : status === "error" ? (
            <div className="space-y-4">
              <ErrorState onReset={() => handleSearch(lastQuery)} />
              <p className="text-center text-sm text-red-500">{errorMessage}</p>
            </div>
          ) : (
            <>
              {hasWeather && <CurrentWeather weather={weatherData} />}
              {hasWeather && <Highlights weather={weatherData} />}
              {hasWeather && <Forecast weather={weatherData} />}
              {hasWeather && <Recommendations weather={weatherData} />}
            </>
          )}
        </div>
      </main>
      <footer className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-7 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <Brand />
            <span className="hidden h-4 w-px bg-slate-200 sm:block" />
            <span>Thoughtful weather for every day.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by Open-Meteo</span>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="WeatherIQ on GitHub" className="transition hover:text-slate-700">
              <Github size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
