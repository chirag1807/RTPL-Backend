const express = require('express');
const authController = require('../Controller/Personnel/authCtrl');
// const { authenticateToken } = require('../Middleware/auth');
const router = express.Router();
const { upload } = require('../utils/multer');


const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require("path");
const validator = require("validator");
const sendMail = require("../Middleware/emaiService")



const COMMON = require("./../Common/common");
const { createAccessToken } = require("./../Middleware/auth");
const CONSTANT = require("./../constant/constant");
const jwt = require("jsonwebtoken");

const inputFieldsEmployee = [
    "empProfileImg",
    "empIdCard",
    "empAadharCard",
    "aadharNumber",
    "permissions",
    "firstName",
    "lastName",
    "emp_code",
    "birthDate",
    "anniversaryDate",
    "email",
    "featureString",
    "phone",
    "password",
    "createdBy",
    "roleID",
    "companyID",
    "officeID",
    "departmentID",
    "designationID",
];

router.post('/login', authController.login);

router.post('/changePassword',
    // authenticateToken,
    authController.changePassword);

router.post('/forgotPassword', authController.forgotPassword);

router.post('/sendCode', authController.sendCode);

router.post('/verifyCode', authController.verifyCode);

router.post('/resetToken', authController.resetToken);
// router.post('/register',
//     upload.fields([
//         { name: 'empAadharCard', maxCount: 1 },
//         { name: 'empIdCard', maxCount: 1 },
//         { name: 'empProfileImg', maxCount: 1 },
//     ]), authController.Registration);

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

router.post(
    "/register",
    AWSHelper.fields([
        { name: 'empAadharCard', maxCount: 1 },
        { name: 'empIdCard', maxCount: 1 },
        { name: 'empProfileImg', maxCount: 1 },
        { name: 'image', maxCount: 20 }
    ]),

    async (req, res) => {
        try {
            const { Employee } = req.app.locals.models;
            const requestData = req.body;
            if (requestData) {
                // get value of CreatedBy
                COMMON.setModelCreatedByFieldValue(req);
                // Validate email
                if (!validator.isEmail(requestData.email)) {
                    return res.status(400).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Invalid email id, please provide valid email id",
                    });
                }
                // Validate phone number
                if (!validator.isMobilePhone(requestData.phone.toString(), "any")) {
                    return res.status(400).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Invalid phone number, please provide valid phone number",
                    });
                }
                const hashedPassword = await COMMON.ENCRYPT(requestData.password);
                if (!hashedPassword) {
                    return res.status(500).json({
                        response_type: "FAILED",
                        data: {},
                        message: CONSTANT.MESSAGE_CONSTANT.SOMETHING_WENT_WRONG,
                    });
                }
                requestData.password = hashedPassword;
                const isExistEmployeeCode = await Employee.findOne({
                    where: {
                        emp_code: requestData.emp_code,
                    },
                });
                if (isExistEmployeeCode) {
                    return res.status(400).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Employee with this Employee Code Already Exist.",
                    });
                }
                const isExistEmailId = await Employee.findOne({
                    where: {
                        email: requestData.email,
                    },
                });
                if (isExistEmailId) {
                    return res.status(400).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Employee with this Email Id Already Exist.",
                    });
                }
                const isExistPhoneNo = await Employee.findOne({
                    where: {
                        phone: requestData.phone,
                    },
                });
                if (isExistPhoneNo) {
                    return res.status(400).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Employee with this Phone No Already Exist.",
                    });
                }
                const isExistAadharNo = await Employee.findOne({
                    where: {
                        aadharNumber: requestData.aadharNumber,
                    },
                });
                if (isExistAadharNo) {
                    res.status(400).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Employee with this Aadhar No Already Exist.",
                    });
                }
                requestData.empAadharCard = req.files.empAadharCard[0].location;
                requestData.empIdCard = req.files.empIdCard[0].location;
                requestData.empProfileImg = req.files.empProfileImg[0].location;
                // const employeeData = { empProfileImgreq.body };
                if (req.body.anniversaryDate == "") {
                    delete requestData.anniversaryDate;
                }
                const employee = await Employee.create(requestData, {
                    fields: inputFieldsEmployee,
                });
                if (employee) {
                    let sender = "rtpl@rtplgroup.com";
                    let subject = "Registeration Successfully Done";
                    let message = `UserID:${employee.emp_code}\nUrl:http://www.rptl.com `;

                    const result = await sendMail(
                        requestData.email,
                        sender,
                        subject,
                        message
                    );
                    res.status(200).json({
                        response_type: "SUCCESS",
                        data: {},
                        message: "Employee registered successfully",
                    })
                } else {
                    res.status(500).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Employee Registration Failed.",
                    });
                }
            } else {
                console.log("Invalid perameter");
                res.status(400).json({
                    response_type: "FAILED",
                    data: {},
                    message: "Invalid perameter",
                });
            }
        } catch (error) {
            console.error("An error occurred:", error);
            res.status(500).json({
                response_type: "FAILED",
                data: {},
                message: error.message,
            });
        }
    })


router.put('/update-profile', upload.fields([
    { name: 'empProfileImg', maxCount: 1 },
]), async (req, res) => {
    try {
      const { Employee } = req.app.locals.models;
      const requestData = req.body;
      console.log("requestData", requestData);
      // requestData.empProfileImg = req.files.empProfileImg[0].location;
      const isempId = await Employee.findOne({
        where: {
          empId: requestData.empId,
        },
      });
      if (!isempId){
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Invalid empId",
        });
      }
  
  
      if (requestData) {
        const updateFields = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          birthDate: req.body.birthDate
        };
        
        // Check if req.files exists and if empProfileImg exists in req.files
        if (req.files && req.files.empProfileImg && req.files.empProfileImg.length > 0) {
          // If empProfileImg exists, add it to the updateFields object
          updateFields.empProfileImg = req.files.empProfileImg[0].location;
        }
        const updateProfile = await Employee.update(
          updateFields,
          {
            where: {
              empId: req.body.empId
            }
          }
        );
        
        if (updateProfile) {
          res.status(200).json({
            response_type: "SUCCESS",
            data: {},
            message: "Employee updated successfully",
          })
        } else {
          res.status(500).json({
            response_type: "FAILED",
            data: {},
            message: "Employee updated Failed.",
          });
        }
      } else {
        console.log("Invalid perameter");
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Invalid perameter",
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).json({
        response_type: "FAILED",
        data: {},
        message: error.message,
      });
    }
  });


module.exports = router;