const express = require('express');
const visitorController = require('../Controller/Visitor/visitorCtrl');
const { isRecept, isActive } = require('../Middleware/auth');
const router = express.Router();
const { upload } = require('../utils/multer');

router.post('/visitor_request_meeting1',

    (req, res, next) => {
        console.log(req.body);
        const maxVisitors = Math.min(req.body.visitors.length, 5); 

        const multerFieldsIDDoc = Array.from({ length: maxVisitors }, (_, index) => ({
            name: `visitors[${index}][vIDDoc]`,
            maxCount: 1 
        }));

        const multerFieldsImage = Array.from({ length: maxVisitors }, (_, index) => ({
            name: `visitors[${index}][vImage]`,
            maxCount: 1 
        }));

        console.log(req.body);

        upload.fields([...multerFieldsIDDoc, ...multerFieldsImage])(req, res, (err) => {
            if(req.body){
                console.log(req.body + " yes");
                next();
            }
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            next();
        });
    },
    visitorController.visitorRequestMeeting
);

router.post('/visitor_request_meeting',
upload.fields([
    { name: 'vIDDoc', maxCount: 5 },
    { name: 'vImage', maxCount: 5 },
]),
visitorController.visitorRequestMeeting);

router.get('/get_visitor_req_list', visitorController.getVisitorRequestMeeting);
router.put('/save_token_by_recpt/:reqMeetingID', isRecept, visitorController.saveTokenByReceptionist);
router.get('/get_visitor_list_bytoken/:TokenNumber', visitorController.getVisitorListByToken);
router.put('/update_visitor_meeting_status/:reqMeetingID', isActive, visitorController.updateVisitorMeetingStatus);
router.get('/get_visitor_list_by_empId/:empId', visitorController.getVisitorMeetingByempId);
router.get('/get_visitor_list_by_reqmeetid/:reqMeetingID', visitorController.getVisitorMeetingByReqMeetingID);
router.get('/get_visitor_by_company_contact', visitorController.getVisitorsByCompanyContact);

module.exports = router;