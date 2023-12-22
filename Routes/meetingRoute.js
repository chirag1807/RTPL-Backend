const express = require('express');
const meetingController = require('../Controller/Meeting/meetingCtrl');
const {authenticateToken} = require('../Middleware/auth');
const router = express.Router();

router.post('/create_meeting', authenticateToken, meetingController.createMeeting);

module.exports = router;