const express = require('express');
const meetingTypeController = require('../Controller/Meeting/meetingTypeCtrl');
const { isAdmin } = require('../Middleware/auth');
const router = express.Router();

router.post('/add_meetingType', isAdmin, meetingTypeController.addMeetingType);
router.get('/get_meetingType_list', meetingTypeController.getMeetingTypes);
router.get('/:meetingTypeID', meetingTypeController.getMeetingTypeByID);
router.put('/:meetingTypeID', isAdmin, meetingTypeController.updateMeetingType);
router.delete('/:meetingTypeID', isAdmin, meetingTypeController.deleteMeetingType);

module.exports = router;