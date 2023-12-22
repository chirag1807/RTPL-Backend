const express = require('express');
const meetingTypeController = require('../Controller/Meeting/meetingTypeCtrl');
const {authenticateToken} = require('../Middleware/auth');
const router = express.Router();

router.post('/add_meetingType', authenticateToken, meetingTypeController.addMeetingType);

module.exports = router;