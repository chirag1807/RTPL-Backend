const express = require('express');
const authController = require('../Controller/Personnel/authCtrl');
const { fileUpload } = require('../utils/multer');
// const { authenticateToken } = require('../Middleware/auth');
const router = express.Router();

router.post('/register',
    fileUpload.fields([
        { name: 'empAadharCard', maxCount: 1 },
        { name: 'empIdCard', maxCount: 1 },
        { name: 'empProfileImg', maxCount: 1 },
    ]), authController.Registration);
router.post('/login', authController.login);

router.post('/changePassword',
    // authenticateToken,
    authController.changePassword);

router.post('/forgotPassword', authController.forgotPassword);

router.post('/sendCode', authController.sendCode);

router.post('/verifyCode', authController.verifyCode);

module.exports = router;