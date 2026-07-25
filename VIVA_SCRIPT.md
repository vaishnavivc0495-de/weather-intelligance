# 2-Minute Viva Script (Level 2)

Use this script during demo or viva.

## 1. Project Summary

I built a Weather Intelligence app using React and Vite with Open-Meteo public APIs.
The app supports city search, current weather, 7-day forecast, recommendations, and invalid city handling.

## 2. APIs Used

I used two Open-Meteo APIs:
- Geocoding API to convert city name into latitude and longitude
- Forecast API to fetch current weather and 7-day forecast data

No private keys, Firebase, Gemini, or Google Cloud APIs are used.

## 3. Functional Requirements Coverage

- Search: user can search city weather
- Current weather: temperature, condition, wind, humidity
- Forecast: 7-day day-wise cards with max/min temperature and weather
- Recommendation: planning suggestions shown as cards
- Error handling: invalid city shows City not found type message

## 4. Build and Deployment

Local run:
- npm install
- npm run dev

Build:
- npm run build
- Output is dist

Cloudflare Pages:
- Connected with GitHub repository
- Build command set to npm run build
- Output directory set to dist
- App validated using pages.dev URL

## 5. Validation Done

I tested two valid cities and one invalid city as required.
I verified current weather, forecast, and recommendation sections are visible and working.

## 6. Repository and Documentation

Repository includes source code, configuration files, and README with setup and deployment steps.

## 7. Closing Line

This satisfies the Level 2 assignment lifecycle: build, test, GitHub integration, Cloudflare deployment, live URL validation, and evidence submission.
