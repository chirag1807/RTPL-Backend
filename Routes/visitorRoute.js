const express = require('express');
const visitorController = require('../Controller/Visitor/visitorCtrl');
const {authenticateToken} = require('../Middleware/auth');
const router = express.Router();

router.post('/visitor_request_meeting', visitorController.visitorRequestMeeting);
router.get('/get_visitor_req_list', visitorController.getVisitorRequestMeeting);
router.put('/save_token_by_recpt/:visitorID', visitorController.saveTokenByReceptionist);
router.get('/get_visitor_list_bytoken/:TokenNumber', visitorController.getVisitorListByToken);
router.put('/update_visitor_meeting_status/:visitorID', visitorController.updateVisitorMeetingStatus);
router.get('/get_visitor_list_by_empid/:empId', visitorController.getVisitorMeetingByEmpID);
router.get('/get_visitor_list_by_visitorid/:visitorId', visitorController.getVisitorMeetingByVisitorID);

module.exports = router;