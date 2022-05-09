const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

//Route POST car le frontend enverra des infos: adress mail et pswd
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;