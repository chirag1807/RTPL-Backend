const express = require('express');
const meetingController = require('../Controller/Meeting/meetingCtrl');
const { isRecept, isActive } = require('../Middleware/auth');
const router = express.Router();

router.post('/create_request_meeting', meetingController.createRequestMeeting);
router.post('/create_outer_meeting', meetingController.createOuterMeeting);
router.put('/update_outer_meeting_status/:outerMeetingID', isRecept, meetingController.updateOuterMeetingStatus);
router.post('/create_appointment_meeting', meetingController.createAppointmentMeeting);
router.put('/update_appointment_meeting_status/:appointmentMeetingID', isRecept, meetingController.updateAppointmentMeetingStatus);
router.post('/start-meeting', isActive, meetingController.startMeeting);
router.post('/end-meeting', isActive, meetingController.endMeeting);
router.post('/reschedule-meeting', isActive, meetingController.rescheduleMeeting);
router.get('/get_meeting_ByCnfRoom/:conferenceRoomID', isActive, meetingController.getMeetingTimesByConferenceRoom);
router.get('/get_meeting_list', isActive, meetingController.getListOfCreatedMeeting);
router.get('/get_meeting_ById/:meetingID', isActive, meetingController.getCreatedMeetingByID);

module.exports = router;