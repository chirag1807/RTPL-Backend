const express = require('express');
const meetingTypeController = require('../Controller/Meeting/meetingTypeCtrl');
const {authenticateToken} = require('../Middleware/auth');
const router = express.Router();

router.post('/add_meetingType', meetingTypeController.addMeetingType);
router.get('/get_meetingType_list', meetingTypeController.getMeetingTypes);
router.get('/:meetingTypeID', meetingTypeController.getMeetingTypeByID);
router.put('/:meetingTypeID', meetingTypeController.updateMeetingType);
router.delete('/:meetingTypeID', meetingTypeController.deleteMeetingType);

module.exports = router;