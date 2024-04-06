const express = require('express');
const meetingController = require('../Controller/Meeting/meetingCtrl');
const { isAdmin, authenticateToken } = require('../Middleware/auth');
const { upload } = require('../utils/multer');
const router = express.Router();

router.post('/create_request_meeting', authenticateToken, meetingController.createRequestMeeting);
router.post('/create_outer_meeting', authenticateToken, meetingController.createOuterMeeting);
router.put('/update_outer_meeting_status/:outerMeetingID', isAdmin(11), meetingController.updateOuterMeetingStatus);
router.post('/create_appointment_meeting', authenticateToken, meetingController.createAppointmentMeeting);
router.put('/update_appointment_meeting_status/:appointmentMeetingID', authenticateToken, meetingController.updateAppointmentMeetingStatus);
router.put('/push-meeting/:meetingID', authenticateToken, meetingController.pushMeeting);
router.put('/follow-up-meeting/:meetingID', authenticateToken, meetingController.followUpMeeting);
router.get('/follow-up-meeting-list', authenticateToken, meetingController.followUpMeetingList);
router.post('/start-meeting', authenticateToken, meetingController.startMeeting);
router.post('/end-meeting', authenticateToken, upload.single('meetingDoc'), meetingController.endMeeting);
router.post('/reschedule-meeting', authenticateToken, meetingController.rescheduleMeeting);
router.post('/cancel-meeting', authenticateToken, meetingController.cancelMeeting);
router.get('/get_meeting_ByCnfRoom/:meetingDate/:conferenceRoomID', meetingController.getMeetingTimesByConferenceRoom);
router.get('/get_meeting_list', authenticateToken, meetingController.getListOfCreatedMeeting);
router.get('/get_appointment_meeting', authenticateToken, meetingController.getAppointmentMeetings);
router.get('/avabletimeslot/:meetingDate',  meetingController.avabletimeslot);
router.get('/get_meeting_ById/:meetingID', authenticateToken, meetingController.getCreatedMeetingByID);


module.exports = router;