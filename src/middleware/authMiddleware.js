const jwt = require('jsonwebtoken');
const models = require('../models')

async function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Token is required' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await models.User.findOne({ where: { id: decoded.id } })
    if(!user) return res.status(404).json({ message: 'User not found' });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = verifyToken;
