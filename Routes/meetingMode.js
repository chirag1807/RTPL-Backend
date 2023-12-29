const express = require('express');
const meetingModeController = require('../Controller/Meeting/meetingModeCtrl');
const { isActive, isAdmin } = require('../Middleware/auth');
const router = express.Router();

router.post('/add_meetingMode', isAdmin, meetingModeController.addMeetingMode);
router.get('/get_meetingMode_list', isActive, meetingModeController.getMeetingModes);
router.get('/:meetingModeID', isActive, meetingModeController.getMeetingModeByID);
router.put('/:meetingModeID', isAdmin, meetingModeController.updateMeetingMode);
router.delete('/:meetingModeID', isAdmin, meetingModeController.deleteMeetingMode);

module.exports = router;