const express = require('express');
const meetingModeController = require('../Controller/Meeting/meetingModeCtrl');
const {authenticateToken} = require('../Middleware/auth');
const router = express.Router();

router.post('/add_meetingMode', meetingModeController.addMeetingMode);
router.get('/get_meetingMode_list', meetingModeController.getMeetingModes);
router.get('/:meetingModeID', meetingModeController.getMeetingModeByID);
router.put('/:meetingModeID', meetingModeController.updateMeetingMode);
router.delete('/:meetingModeID', meetingModeController.deleteMeetingMode);

module.exports = router;