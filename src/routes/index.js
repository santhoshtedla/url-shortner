const express = require('express');
const router = express.Router();
const authRoutes = require('./auth/index')
const urlRoutes = require('./url/index')

router.use("/auth", authRoutes);
router.use("/", urlRoutes);
module.exports = router;