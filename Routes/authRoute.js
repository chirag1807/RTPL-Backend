const express = require('express');
const authController = require('../Controller/Personnel/authCtrl');
// const { authenticateToken } = require('../Middleware/auth');
const router = express.Router();

router.post('/register',
    // authenticateToken,
    authController.Registration);
router.post('/login', authController.login);

router.post('/changePassword',
    // authenticateToken,
    authController.changePassword);

router.post('/forgotPassword', authController.forgotPassword);

router.post('/sendCode', authController.sendCode);

router.post('/verifyCode', authController.verifyCode);

router.post('/resetToken', authController.resetToken);

module.exports = router;