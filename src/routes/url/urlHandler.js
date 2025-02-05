const { createShortLink, getLongUrl, retrieveUrlData, retrieveTopicBasedAnalytics, fetchOverallAnalytics } = require('../../controllers/urlController')

async function generateShortUrl(req, res) {
    try {
      const result = await createShortLink(req.body, req.user.id);
      res.status(200).send({
        success: true,
        result: result,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        error: error.message || error.name || error,
      })
    }
}

async function redirectToOriginalUrl(req, res) {
  try {

    const longUrl = await getLongUrl(req.params.alias, req.headers['user-agent'], req.ip, req.user.id);
    res.redirect(longUrl);
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message || error.name || error,
    })
  }
}

async function getUrlAnalytics(req, res) {
  try {
    const result = await retrieveUrlData(req.params);
    res.status(200).send({
      success: true,
      result: result,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message || error.name || error,
    })
  }
}

async function getTopicBasedAnalytics(req, res) {
  try {
    const result = await retrieveTopicBasedAnalytics(req.params.topic);
    res.status(200).send({
      success: true,
      result: result,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message || error.name || error,
    })
  }
}

async function getOverallAnalytics(req, res) {
  try {
    const result = await fetchOverallAnalytics(req.user.id);
    res.status(200).send({
      success: true,
      result: result,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message || error.name || error,
    })
  }
}

module.exports = { generateShortUrl, redirectToOriginalUrl, getUrlAnalytics, getTopicBasedAnalytics, getOverallAnalytics };