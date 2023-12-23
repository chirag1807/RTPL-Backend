const express = require('express');
const visitorController = require('../Controller/Visitor/visitorCtrl');
const {authenticateToken} = require('../Middleware/auth');
const router = express.Router();

router.post('/visitor_request_meeting', visitorController.visitorRequestMeeting);
router.get('/get_visitor_req_list', visitorController.getVisitorRequestMeeting);

module.exports = router;