const jwt = require('jsonwebtoken');
const passport = require('passport');

// Controller to handle the Google OAuth authentication
exports.googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

// Controller for the Google OAuth callback
exports.googleCallback = passport.authenticate( 'google', {
  successRedirect: '/api/auth/generateToken',
  failureRedirect: '/google/failure'
});

exports.getUserProfile = (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

exports.generateToken  = (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user.id, email: user.email, firstName: user.firstName },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.setHeader('Authorization', token);
    res.status(200).json({
      message: 'LOG_IN successful',
      token
    });
};