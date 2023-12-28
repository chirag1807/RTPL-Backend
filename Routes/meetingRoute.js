const express = require('express');
const meetingController = require('../Controller/Meeting/meetingCtrl');
const { authenticateToken } = require('../Middleware/auth');
const router = express.Router();

router.post('/create_request_meeting', meetingController.createRequestMeeting);
router.post('/create_outer_meeting', meetingController.createOuterMeeting);
router.put('/update_outer_meeting_status/:outerMeetingID', meetingController.updateOuterMeetingStatus);
router.post('/create_appointment_meeting', meetingController.createAppointmentMeeting);
router.put('/update_appointment_meeting_status/:appointmentMeetingID', meetingController.updateAppointmentMeetingStatus);
router.post('/start-meeting', meetingController.startMeeting);
router.post('/end-meeting', meetingController.endMeeting);
router.post('/reschedule-meeting', meetingController.rescheduleMeeting);
router.get('/get_meeting_ByCnfRoom/:conferenceRoomID',meetingController.getMeetingTimesByConferenceRoom);
router.get('/get_meeting_list', meetingController.getListOfCreatedMeeting);
router.get('/get_meeting_ById/:meetingID', meetingController.getCreatedMeetingByID);

module.exports = router;