const express = require('express');
const internalTeamController = require('../Controller/InternalTeamSelection/internalTeamSelectCtrl');
const { isActive } = require('../Middleware/auth');
const router = express.Router();

router.get('/getInternalTeam/:meetingID', isActive, internalTeamController.getInternalMembersByMeetingID);
router.get('/getMeetings/:empId', isActive, internalTeamController.getMeetingsForInternalTeam);
router.put('/updateInternalMember', isActive, internalTeamController.updateInternalMember);
router.delete('/deleteInternalMember', isActive, internalTeamController.deleteInternalMember);

module.exports = router;