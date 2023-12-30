const express = require('express');
const conferenceRoomController = require('../Controller/ConferenceRoom/ConferenceRoomCtrl');
const { isAdmin } = require('../Middleware/auth');
const router = express.Router();

router.post('/addConferenceRoom', isAdmin, conferenceRoomController.addConferenceRoom);
router.get('/getConferenceRoomList', conferenceRoomController.getConferenceRooms);
router.get('/:conferenceRoomID', conferenceRoomController.getConferenceRoomByID);
router.get('/getConferenceRoomByOfficeID/:officeID', conferenceRoomController.getConferenceRoomByOfficeID);
router.put('/:conferenceRoomID', isAdmin, conferenceRoomController.updateConferenceRoom);
router.delete('/:conferenceRoomID', isAdmin, conferenceRoomController.deleteConferenceRoom);

module.exports = router;