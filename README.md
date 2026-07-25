# Weather Intelligence Platform

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61dafb)
![Deploy](https://img.shields.io/badge/deploy-Cloudflare%20Pages-orange)
![API](https://img.shields.io/badge/api-Open--Meteo-blue)

A weather intelligence web application built with React, Vite, and Open-Meteo APIs. Users can search for cities, view current weather conditions, browse a 7-day forecast, and receive practical weather recommendations.

## What’s included

- City search with geocoding
- Current weather details
- 7-day forecast cards
- Weather-based recommendation cards
- Invalid city handling
- Network error handling
- Responsive layout for desktop and mobile

## Quick Start

### Install

`ash
git clone https://github.com/vaishnavivc0495-de/weather-intelligance.git
cd weather-intelligence
npm install
`

### Run locally

`ash
npm run dev
`

Open the app at:

- http://localhost:8080

### Build for production

`ash
npm run build
`

### Optional local production server

`ash
npm run build:server
npm run start
`

## Project Layout

- client/ — React frontend pages and UI components
- unctions/api/weather.js — serverless weather API adapter
- server/ — Express API for local development
- public/ — static assets
- package.json — project scripts and dependencies
- README.md — project documentation

## API Endpoint

`http
GET /api/weather?city=<city-name>
`

The API resolves the city name, fetches forecast data from Open-Meteo, and returns a normalized JSON response.

## Deployment

This project is suitable for Cloudflare Pages deployment or another static hosting provider that supports serverless functions. Use 
pm run build and deploy the dist/ output.

## Notes

- No private API keys are required
- Local secret files are excluded from git tracking
- The current GitHub repository URL is https://github.com/vaishnavivc0495-de/weather-intelligance

## Validation

Try these searches in the app:

- Chennai
- Bangalore
- InvalidCity987654

## License

Add a LICENSE file if you want to publish this project as open source.
