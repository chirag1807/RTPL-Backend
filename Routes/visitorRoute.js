const express = require('express');
const visitorController = require('../Controller/Visitor/visitorCtrl');
const { isRecept, isActive } = require('../Middleware/auth');
const router = express.Router();
const { fileUpload } = require('../utils/multer');

router.post('/visitor_request_meeting',
    (req, res, next) => {
        const maxVisitors = Math.min(req.body.visitor.length, 5); 

        const multerFieldsIDDoc = Array.from({ length: maxVisitors }, (_, index) => ({
            name: `visitor[${index}].vIDDoc`,
            maxCount: 1 
        }));

        const multerFieldsImage = Array.from({ length: maxVisitors }, (_, index) => ({
            name: `visitor[${index}].vImage`,
            maxCount: 1 
        }));

        fileUpload.fields([...multerFieldsIDDoc, ...multerFieldsImage])(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            next();
        });
    },
    visitorController.visitorRequestMeeting
);
router.get('/get_visitor_req_list', visitorController.getVisitorRequestMeeting);
router.put('/save_token_by_recpt/:reqMeetingID', isRecept, visitorController.saveTokenByReceptionist);
router.get('/get_visitor_list_bytoken/:TokenNumber', visitorController.getVisitorListByToken);
router.put('/update_visitor_meeting_status/:reqMeetingID', isActive, visitorController.updateVisitorMeetingStatus);
router.get('/get_visitor_list_by_empId/:empId', visitorController.getVisitorMeetingByempId);
router.get('/get_visitor_list_by_reqmeetid/:reqMeetingID', visitorController.getVisitorMeetingByReqMeetingID);

module.exports = router;