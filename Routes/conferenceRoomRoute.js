const express = require('express');
const conferenceRoomController = require('../Controller/ConferenceRoom/ConferenceRoomCtrl');
const {authenticateToken} = require('../Middleware/auth');
const router = express.Router();

router.post('/addConferenceRoom', conferenceRoomController.addConferenceRoom);
router.get('/getConferenceRoomList', conferenceRoomController.getConferenceRooms);
router.get('/:conferenceRoomID', conferenceRoomController.getConferenceRoomByID);
router.get('/getConferenceRoomByOfficeID/:officeID', conferenceRoomController.getConferenceRoomByOfficeID);
router.put('/:conferenceRoomID', conferenceRoomController.updateConferenceRoom);
router.delete('/:conferenceRoomID', conferenceRoomController.deleteConferenceRoom);

module.exports = router;