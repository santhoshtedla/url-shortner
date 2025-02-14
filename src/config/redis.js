const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

client.connect();

client.on('error', (err) => {
  console.log('Redis client error: ' + err);
});

module.exports = client;