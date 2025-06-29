const express = require('express');
const router = express.Router();
const User = require('../models/User');
require('dotenv').config();

function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// API Mashup: OpenWeather + Wikipedia
router.get('/search', requireAuth, async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query parameter ?q=' });

  try {
    // 1. Weather API
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${process.env.OPENWEATHER_KEY}&units=metric`
    );
    const weatherData = await weatherRes.json();
    if (weatherRes.status !== 200) {
      return res.status(400).json({ error: `Weather error: ${weatherData.message}` });
    }
    const weatherInfo = `${weatherData.weather[0].description}, ${weatherData.main.temp} °C`;

    // 2. Wikipedia API
    const wikiRes = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    const wikiData = await wikiRes.json();
    const summary = wikiData.extract || 'No summary available.';

    // Save to history
    await User.findByIdAndUpdate(req.session.user, {
      $push: { searchHistory: { term: query } }
    });

    res.json({ weather: weatherInfo, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'API error' });
  }
});

// Get search history
router.get('/history', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.user);
    res.json(user.searchHistory);
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve history' });
  }
});

module.exports = router;
