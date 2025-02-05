const dotenv = require('dotenv');
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const apiRoute = require('./routes/index');
const securityMiddleware = require('./middleware/rateLimitter');
require('./config/passport-config');
require('./models/index');

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup for Passport.js
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

securityMiddleware(app);
app.get('/', (req, res) => {
  res.send('<a href="/api/auth/google">Authenticate with Googlee</a>');
});

app.use('/api', apiRoute);

app.get('/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

app.listen(port, async () => {
    try {
      console.log(`Server is running on http://localhost:${port}`);
    } catch (error) {
      console.log('Unable to connect to the server:', error);
    }
});

module.exports = app;