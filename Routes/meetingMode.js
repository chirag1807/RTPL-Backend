const express = require('express');
const meetingModeController = require('../Controller/Meeting/meetingModeCtrl');
const {authenticateToken} = require('../Middleware/auth');
const router = express.Router();

router.post('/visitor_request_meeting', authenticateToken, meetingModeController.addMeetingMode);

module.exports = router;