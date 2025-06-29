const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Registration route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({ error: 'Username already exists' });

        const user = new User({ username, password });
        await user.save();

        req.session.user = user._id; // Log user in
        res.status(201).json({ message: 'User registered', user: { username: user.username } });
    } catch (err) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Invalid username or password' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid username or password' });

        req.session.user = user._id;
        res.json({ message: 'Logged in', user: { username: user.username } });
    } catch (err) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: 'Could not log out' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out' });
    });
});

// Check if logged in
router.get('/me', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });

    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user: { username: user.username } });
});

module.exports = router;
