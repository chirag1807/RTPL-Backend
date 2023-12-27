const express = require('express');
const meetingController = require('../Controller/Meeting/meetingCtrl');
const { authenticateToken } = require('../Middleware/auth');
const router = express.Router();

router.post('/create_meeting', meetingController.createMeeting);
router.post('/start-meeting', meetingController.startMeeting);
router.post('/end-meeting', meetingController.endMeeting);
router.post('/reschedule-meeting', meetingController.rescheduleMeeting);
// router.get('/get_meeting_list', meetingController.getListOfCreatedMeeting);
// router.get('/get_meeting_ById/:meetingID', meetingController);

module.exports = router;