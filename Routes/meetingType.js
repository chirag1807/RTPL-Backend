const express = require('express');
const meetingTypeController = require('../Controller/Meeting/meetingTypeCtrl');
const { isAdmin } = require('../Middleware/auth');
const router = express.Router();

router.post('/add_meetingType', isAdmin(8), meetingTypeController.addMeetingType);
router.get('/get_meetingType_list', meetingTypeController.getMeetingTypes);
router.get('/:meetingTypeID', meetingTypeController.getMeetingTypeByID);
router.put('/:meetingTypeID', isAdmin(8), meetingTypeController.updateMeetingType);
router.delete('/:meetingTypeID', isAdmin(8), meetingTypeController.deleteMeetingType);

module.exports = router;