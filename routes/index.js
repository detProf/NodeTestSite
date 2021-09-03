const express = require('express');
const indexCon = require('../controllers/index');
const router = express.Router();

router.get('/', indexCon.get);

module.exports = router;