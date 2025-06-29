require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, 'public')));

function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/');
}

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
