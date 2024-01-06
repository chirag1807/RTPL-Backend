const express = require('express');
const conferenceRoomController = require('../Controller/ConferenceRoom/ConferenceRoomCtrl');
const { isAdmin } = require('../Middleware/auth');
const router = express.Router();

router.post('/addConferenceRoom', isAdmin(2), conferenceRoomController.addConferenceRoom);
router.get('/getConferenceRoomList', conferenceRoomController.getConferenceRooms);
router.get('/:conferenceRoomID', conferenceRoomController.getConferenceRoomByID);
router.get('/getConferenceRoomByOfficeID/:officeID', conferenceRoomController.getConferenceRoomByOfficeID);
router.put('/:conferenceRoomID', isAdmin(2), conferenceRoomController.updateConferenceRoom);
router.delete('/:conferenceRoomID', isAdmin(2), conferenceRoomController.deleteConferenceRoom);

module.exports = router;