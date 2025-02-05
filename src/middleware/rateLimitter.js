const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const securityMiddleware = (app) => {
  // Helmet helps secure your Express apps by setting various HTTP headers.
  app.use(helmet());

  // Rate limiter to prevent DDoS attacks
  const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 250, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  });

  app.use(limiter);
};

module.exports =  securityMiddleware;
