const express = require('express');
const router = express.Router();
router.use('/auth', require('./auth.routes'));
router.use('/tasks', require('./task.routes'));
module.exports = router;