# Weather Intelligence Platform

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61dafb)
![Deploy](https://img.shields.io/badge/deploy-Cloudflare%20Pages-orange)
![API](https://img.shields.io/badge/api-Open--Meteo-blue)

A production-style weather intelligence application built with React, Vite, and Open-Meteo APIs. The app lets users search cities, view current weather, inspect 7-day forecast trends, and receive practical planning recommendations.

## Table of Contents

- Overview
- Architecture
- Features
- Tech Stack
- Project Structure
- API Design
- Recommendation Rules
- Setup and Run
- Deployment
- Security Notes
- QA and Validation
- Submission Evidence Checklist
- License

## Overview

### Problem Statement
Users need quick and clear weather insights for daily planning, but many weather tools are cluttered, key-gated, or not assignment-friendly.

### Solution
This project provides:
- Fast city-based search
- Current weather overview
- 7-day forecast cards
- Rule-driven recommendations
- Friendly invalid city and network error states

### Target Users
- Learners completing app deployment assignments
- Users planning daily activities using weather conditions
- Recruiters evaluating frontend + API + deployment skills

## Architecture

The app uses a React SPA frontend and a lightweight API adapter for weather data.

### Runtime Modes
- Local: Vite development server with Express middleware
- Cloud: Cloudflare Pages deployment with serverless function support

## Features

- City search
- Current weather details (temperature, condition, wind, humidity, pressure, sunrise/sunset)
- 7-day forecast cards
- Recommendation cards based on weather values
- Invalid city handling
- Network failure handling
- Responsive layout

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React icons
- Express 5 for local API integration
- Cloudflare Pages Functions for deployment
- Open-Meteo APIs for geocoding and forecasts

## Project Structure

`	ext
weather-intelligence/
├─ client/
│  ├─ components/ui/
│  ├─ hooks/
│  ├─ lib/
│  ├─ pages/
│  ├─ App.jsx
│  └─ global.css
├─ functions/api/weather.js
├─ server/
│  ├─ routes/
│  └─ index.js
├─ public/
├─ package.json
├─ README.md
├─ vite.config.js
└─ tailwind.config.js
`

## API Design

### Main endpoint

`http
GET /api/weather?city=<city-name>
`

### Expected behavior
- Resolve city name to coordinates
- Request current and daily weather data
- Return normalized JSON

## Setup and Run

### Prerequisites
- Node.js 20 or newer
- npm 10 or newer

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

### Build for production

`ash
npm run build
`

## Deployment

Deploy the app to Cloudflare Pages or another static hosting provider with serverless function support.

## Security Notes

- No private API keys are required for this project
- Local secret files are excluded from git tracking

## QA and Validation

Verify the app by searching for:
- Chennai
- Bangalore
- InvalidCity987654

## Submission Evidence Checklist

Capture screenshots of:
1. GitHub repository home page
2. README rendered on GitHub
3. Cloudflare build configuration
4. Deployed site working in browser

## License

Add a license file for clarity, for example MIT.
