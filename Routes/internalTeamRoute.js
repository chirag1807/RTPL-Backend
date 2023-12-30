const express = require('express');
const internalTeamController = require('../Controller/InternalTeamSelection/internalTeamSelectCtrl');
const { authenticateToken } = require('../Middleware/auth');
const router = express.Router();

router.get('/getInternalTeam/:meetingID', internalTeamController.getInternalMembersByMeetingID);
router.get('/getMeetings/:empId', internalTeamController.getMeetingsForInternalTeam);
router.put('/updateInternalMember', internalTeamController.updateInternalMember);
router.delete('/deleteInternalMember', internalTeamController.deleteInternalMember);
router.put('/takeAttendance', internalTeamController.takeAttendanceOfInternalMembers);

module.exports = router;