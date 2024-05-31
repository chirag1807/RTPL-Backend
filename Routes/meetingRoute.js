const express = require('express');
const meetingController = require('../Controller/Meeting/meetingCtrl');
const { isAdmin, authenticateToken } = require('../Middleware/auth');
const { upload } = require('../utils/multer');
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require("path");

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: process.env.AWS_REGION
});

const s3Storage = multerS3({
    s3: s3,
    bucket: "rtpl-bucket",
    metadata: (req, file, cb) => {
        cb(null, { fieldname: file.fieldname });
    },
    key: (req, file, cb) => {
        const fileName = file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
});

function sanitizeFile(file, cb) {
    const fileExts = [".png", ".pdf", ".jpg", ".jpeg", ".gif", ".doc", ".docx",".mp4"];

    const isAllowedExt = fileExts.includes(
        path.extname(file.originalname.toLowerCase())
    );

    // Mime type must be an image or PDF or document
    const isAllowedMimeType =
        file.mimetype.startsWith("image/") ||
        file.mimetype === "application/pdf" ||
        file.mimetype === "video/mp4" ||
        file.mimetype === "application/msword" ||
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true); // no errors
    } else {
        // pass error msg to callback, which can be displayed in frontend
        cb("Error: File type not allowed!");
    }
}

// Middleware configuration
const AWSHelper = multer({
    storage: s3Storage,
    fileFilter: (req, file, callback) => {
        sanitizeFile(file, callback);
    },
    limits: {
        fileSize: 1024 * 1024 * 500 // 500 MB file size limit
    }
});


router.post('/create_request_meeting', authenticateToken, meetingController.createRequestMeeting);
router.post('/create_outer_meeting', authenticateToken, meetingController.createOuterMeeting);
router.put('/update_outer_meeting_status/:outerMeetingID', isAdmin(11), meetingController.updateOuterMeetingStatus);
router.post('/create_appointment_meeting', authenticateToken, meetingController.createAppointmentMeeting);
router.put('/update_appointment_meeting_status/:appointmentMeetingID', authenticateToken, meetingController.updateAppointmentMeetingStatus);
router.put('/follow-up-meeting/:meetingID', meetingController.followUpMeeting);
router.get('/follow-up-meeting-list', authenticateToken, meetingController.followUpMeetingList);
router.post('/start-meeting', meetingController.startMeeting);

router.post('/reschedule-meeting', authenticateToken, meetingController.rescheduleMeeting);
router.post('/cancel-meeting', authenticateToken, meetingController.cancelMeeting);
router.get('/get_meeting_ByCnfRoom/:meetingDate/:conferenceRoomID', meetingController.getMeetingTimesByConferenceRoom);
router.get('/avable-con-room/:meetingDate/:officeID', meetingController.avableConRoom);
router.get('/get_meeting_list', authenticateToken, meetingController.getListOfCreatedMeeting);
router.get('/get_appointment_meeting', authenticateToken, meetingController.getAppointmentMeetings);
router.get('/avabletimeslot/:meetingDate/:conroomId', meetingController.avabletimeslot);
router.get('/get_meeting_ById/:meetingID', authenticateToken, meetingController.getCreatedMeetingByID);
router.post('/push-meeting',
AWSHelper.fields([
        { name: 'pdffile', maxCount: 1 },
        { name: 'docfile', maxCount: 1 },
        { name: 'docfile1', maxCount: 1 },
    ]), async (req, res) => {
        try {
            if (req.params && req.body) {
                const { Meeting } = req.app.locals.models;
                const { meetingID } = req.body;
                const data = [
                    req.files.pdffile ? `'${req.files.pdffile[0].location}'` : 'null',
                    req.files.docfile ? `'${req.files.docfile[0].location}'` : 'null',
                    req.files.docfile1 ? `'${req.files.docfile1[0].location}'` : 'null'
                ].join(', ');


                const isMeeting = await Meeting.findOne({
                    where: { meetingID },
                });

                if (!isMeeting) {
                    return res.status(404).json({
                        response_type: "FAILED",
                        data: {},
                        message:
                            "Meeting not found for the given Meeting ID.",
                    });
                }
                await Meeting.update({ pushData: data },
                    { where: { meetingID } });

                res.status(200).json({
                    response_type: "SUCCESS",
                    message: "Meeting Data Add successfully",
                    data: {},
                });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                response_type: "FAILED",
                data: {},
                message: error.message,
            });
        }
    }
);


router.post('/end-meeting', AWSHelper.fields([
    { name: 'pdffile', maxCount: 1 },
    { name: 'docfile', maxCount: 1 },
    { name: 'docfile1', maxCount: 1 },
]), async (req, res) => {
    try {
        const { Meeting, RequestMeeting, AppointmentMeeting } = req.app.locals.models;
        const { meetingID, status, remark ,requestId} = req.body;
        const data = [
            req.files.pdffile ? `'${req.files.pdffile[0].location}'` : 'null',
            req.files.docfile ? `'${req.files.docfile[0].location}'` : 'null',
            req.files.docfile1 ? `'${req.files.docfile1[0].location}'` : 'null'
        ].join(', ');
        const dataArray = data.replace(/'/g, "").split(', ');

        const pdf = dataArray[0]
        const image = dataArray[1]
        const video = dataArray[2]

        if (!meetingID) {
            return res.status(400).json({
                response_type: "FAILED",
                data: {},
                message: "timeSlotID is required in the request body",
            });
        }
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const seconds = currentTime.getSeconds();
        const formattedTime = `${hours}:${minutes}:${seconds}`;


        await Meeting.update(
            { status, remark, pdf, image, video, stoppedAt: formattedTime },
            {
                where: { meetingID },
                fields: ["status", "remark", "pdf", "image", "video", "stoppedAt"]
            }
        );
        const existingMeeting = await Meeting.findByPk(meetingID);

        // Update request meeting status
        await AppointmentMeeting.update(
            {status},
            {where: existingMeeting.appointmentMeetingID}
          );  
        // ReqStatus
        await RequestMeeting.update(
            { ReqStatus: status},
            { where: { id: requestId}}
        )


        res.status(200).json({
            response_type: "SUCCESS",
            data: {},
            message: "Meeting has ended successfully.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            response_type: "FAILED",
            data: {},
            message: error.message,
        });
    }
});

module.exports = router;