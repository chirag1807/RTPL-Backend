const express = require('express');
const visitorController = require('../Controller/Visitor/visitorCtrl');
const {authenticateToken} = require('../Middleware/auth');
const router = express.Router();

router.post('/visitor_request_meeting', authenticateToken, visitorController.visitorRequestMeeting);

module.exports = router;