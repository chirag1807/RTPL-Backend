const express = require('express');
const meetingModeController = require('../Controller/Meeting/meetingModeCtrl');
const { isAdmin } = require('../Middleware/auth');
const router = express.Router();

router.post('/add_meetingMode', isAdmin(7), meetingModeController.addMeetingMode);
router.get('/get_meetingMode_list', meetingModeController.getMeetingModes);
router.get('/:meetingModeID', meetingModeController.getMeetingModeByID);
router.put('/:meetingModeID', isAdmin(7), meetingModeController.updateMeetingMode);
router.delete('/:meetingModeID', isAdmin(7), meetingModeController.deleteMeetingMode);

module.exports = router;