const router = require('express').Router();
const { googleLogin, googleCallback, getUserProfile, generateToken } = require('../../controllers/authController');
const authentication = require('../../middleware/authMiddleware');

// Google login route
router.get('/google', googleLogin);

// Google callback route
router.get('/google/callback', googleCallback);

router.get('/generateToken', generateToken);
// Protected dashboard route (example)
router.get('/profile', authentication, getUserProfile);

module.exports = router;