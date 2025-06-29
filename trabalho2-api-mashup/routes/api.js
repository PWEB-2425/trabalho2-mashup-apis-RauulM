const express = require('express');
const router = express.Router();
require('dotenv').config();

// Middleware to protect API routes
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Route: GET /api/search?q=porto
router.get('/search', requireAuth, async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query parameter ?q=' });

  try {
    // ---- 1. OpenWeather API Call ----
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${process.env.OPENWEATHER_KEY}&units=metric`
    );
    const weatherData = await weatherRes.json();

    if (weatherRes.status !== 200) {
      return res.status(400).json({ error: `Weather error: ${weatherData.message}` });
    }

    const weatherInfo = `${weatherData.weather[0].description}, ${weatherData.main.temp}°C`;

    // ---- 2. Wikipedia Summary Call ----
    const wikiRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
    );
    const wikiData = await wikiRes.json();

    const summary = wikiData.extract || 'No summary found';

    // ---- 3. Return Combined Response ----
    res.json({
      query,
      weather: weatherInfo,
      summary,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
