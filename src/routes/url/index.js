const router = require('express').Router();
const { generateShortUrl, redirectToOriginalUrl, getUrlAnalytics, getTopicBasedAnalytics, getOverallAnalytics } = require('./urlHandler');
const authentication = require('../../middleware/authMiddleware');

router.use(authentication);
router.post('/shorten', generateShortUrl);
router.get('/analytics/overall', getOverallAnalytics);
router.get('/shorten/:alias', redirectToOriginalUrl);
router.get('/analytics/:alias', getUrlAnalytics);
router.get('/analytics/topic/:topic', getTopicBasedAnalytics);

module.exports = router;