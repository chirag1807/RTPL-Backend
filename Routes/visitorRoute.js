const express = require('express');
const visitorController = require('../Controller/Visitor/visitorCtrl');
const { isRecept, isActive } = require('../Middleware/auth');
const router = express.Router();
const { upload } = require('../utils/multer');



const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require("path");
const validator = require("validator");
const sendMail = require("../Middleware/emaiService")



// router.post('/visitor_request_meeting1',

//     (req, res, next) => {
//         console.log(req.body);
//         const maxVisitors = Math.min(req.body.visitors.length, 5); 

//         const multerFieldsIDDoc = Array.from({ length: maxVisitors }, (_, index) => ({
//             name: `visitors[${index}][vIDDoc]`,
//             maxCount: 1 
//         }));

//         const multerFieldsImage = Array.from({ length: maxVisitors }, (_, index) => ({
//             name: `visitors[${index}][vImage]`,
//             maxCount: 1 
//         }));

//         upload.fields([...multerFieldsIDDoc, ...multerFieldsImage])(req, res, (err) => {
//             if(req.body){
//                 console.log(req.body + " yes");
//                 next();
//             }
//             if (err) {
//                 return res.status(400).json({ error: err.message });
//             }
//             next();
//         });
//     },
//     visitorController.visitorRequestMeeting
// );

router.get('/get_visitor_req_list', visitorController.getVisitorRequestMeeting);
router.get('/get_visitor_pending_req_list', visitorController.getVisitorPendingRequestMeeting);
router.put('/save_token_by_recpt/:reqMeetingID', isRecept, visitorController.saveTokenByReceptionist);
router.get('/get_visitor_list_bytoken/:TokenNumber', visitorController.getVisitorListByToken);
router.put('/update_visitor_meeting_status/:reqMeetingID', isActive, visitorController.updateVisitorMeetingStatus);
router.get('/get_visitor_list_by_empId/:empId', visitorController.getVisitorMeetingByempId);
router.get('/get_visitor_list_by_reqmeetid/:reqMeetingID', visitorController.getVisitorMeetingByReqMeetingID);
router.post('/get_visitor_by_company_contact', visitorController.getVisitorsByCompanyContact);

const inputFieldsRequestmeeting = [
    "typeOfVisitor",
    "vCompanyName",
    "vCompanyIndustry",
    "vCompanyAddress",
    "vCompanyContact",
    "vCompanyEmail",
    "vCompanyGST",
    "purposeOfMeeting",
    "contactPersonName",
    "reqMeetDetailsID",
    "ReqStatus",
    "DeclineReason",
  ];
  const inputFieldsVisitorDetails = [
    "reqMeetingID",
    "vFirstName",
    "vLastName",
    "vDateOfBirth",
    "vAnniversaryDate",
    "vDesignation",
    "vDepartment",
    "vPANCard",
    "vAddress",
    "vContact",
    "vMailID",
    "vLiveImage",
    "vPhotoID",
    "vVisitorID",
  ];

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
    const fileExts = [".png", ".pdf", ".jpg", ".jpeg", ".gif", ".doc", ".docx"];
  
    const isAllowedExt = fileExts.includes(
      path.extname(file.originalname.toLowerCase())
    );
  
    // Mime type must be an image or PDF or document
    const isAllowedMimeType =
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf" ||
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
  
  router.put(
    "/visitor_request_meeting",
    AWSHelper.array("image", 20),
    async (req, res) => {
      try {
        const imageFiles = req.files.map(file => file.location);
        const { RequestMeeting, ReqMeetVisitorDetails } = req.app.locals.models;
  
        // Check if request body exists
        if (!req.body) {
          return res.status(400).json({
            response_type: "FAILED",
            data: {},
            message: "Invalid parameter: request body is missing",
          });
        }
  
        // Validate email and phone number
        if (req.body.vCompanyEmail && !validator.isEmail(req.body.vCompanyEmail)) {
          return res.status(400).json({
            response_type: "FAILED",
            data: {},
            message: "Invalid email.",
          });
        }
  
        if (req.body.vCompanyContact && !validator.isMobilePhone(req.body.vCompanyContact.toString(), "any")) {
          return res.status(400).json({
            response_type: "FAILED",
            data: {},
            message: "Invalid phone number.",
          });
        }
  
        // Create request meeting
        const requestMeeting = await RequestMeeting.create(req.body, {
          fields: inputFieldsRequestmeeting,
        });
  
        if (!requestMeeting) {
          return res.status(400).json({
            response_type: "FAILED",
            data: {},
            message: "Sorry, Your meeting request has not registered. Please try again later",
          });
        }
        let updatedList = [];
        if (imageFiles.length > 0) {
          const chunkSize = Math.ceil(req.files.length / 3);
          const uploadedLiveImages = [];
          const uploadedPhotoIDs = [];
          const uploadedVisitorIDs = [];
  
          if (req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
              if (i % 3 === 0) {
                uploadedLiveImages.push(req.files[i].location);
              } else if ((i - 1) % 3 === 0) {
                uploadedPhotoIDs.push(req.files[i].location);
              } else {
                uploadedVisitorIDs.push(req.files[i].location);
              }
            }
          }
  
  
          updatedList = req.body.visitors.map((visitor, index) => ({
            ...visitor,
            reqMeetingID: requestMeeting.reqMeetingID,
            vLiveImage: uploadedLiveImages[index],
            vPhotoID: uploadedPhotoIDs[index],
            vVisitorID: uploadedVisitorIDs[index],
          }));
        } else {
          updatedList = JSON.parse(req.body.visitors).map(visitor => ({
            ...visitor,
            reqMeetingID: requestMeeting.reqMeetingID,
          }));
        }
  
  
  
        // Save visitor details
        await Promise.all(updatedList.map(async (visitor) => {
          await ReqMeetVisitorDetails.create(visitor, {
            fields: inputFieldsVisitorDetails,
          });
        }));
  
        // Send email
        const mailSubject = "Meeting Request Created";
        const mailMessage = "Your meeting request has been registered successfully.";
  
        if (requestMeeting.typeOfVisitor == "Company") {
          await sendMail(
            req.body.vCompanyEmail,
            "rtpl@rtplgroup.com",
            mailSubject,
            mailMessage
          );
        } else {
          await sendMail(
            JSON.parse(req.body.visitors)[0].vMailID,
            "rtpl@rtplgroup.com",
            mailSubject,
            mailMessage
          );
        }
  
        res.status(200).json({
          response_type: "SUCCESS",
          data: {},
          message: "Your meeting request has been registered successfully.",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          response_type: "FAILED",
          data: {},
          message: error.message,
        });
      }
    }
  );



module.exports = router;