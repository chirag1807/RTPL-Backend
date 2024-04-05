const express = require('express');
const internalTeamController = require('../Controller/InternalTeamSelection/internalTeamSelectCtrl');
const router = express.Router();

router.put('/addInternalMember', internalTeamController.addInternalMembers)
router.get('/getInternalTeam/:meetingID', internalTeamController.getInternalMembersByMeetingID);
router.get('/getMeetings/:empId', internalTeamController.getMeetingsForInternalTeam);
router.put('/updateInternalMember', internalTeamController.updateInternalMember);
router.delete('/deleteInternalMember', internalTeamController.deleteInternalMember);
router.put('/takeAttendance', internalTeamController.takeAttendanceOfInternalMembers);
router.put('takeAttendanceOfVisitors', internalTeamController.takeAttendanceOfVisitors);

module.exports = router;