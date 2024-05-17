const express = require('express');
const adminController = require('../Controller/Personnel/adminCtrl');
const { isSuper } = require('../Middleware/auth');
const { upload } = require('../utils/multer');
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require("path");
const validator = require("validator");
const sendMail = require("../Middleware/emaiService")
const router = express.Router();

const COMMON = require("./../Common/common");
const CONSTANT = require("./../constant/constant");

const { createAccessToken } = require("./../Middleware/auth");

const inputFieldsEmployee = [
  "empProfileImg",
  "empIdCard",
  "empAadharCard",
  "permissions",
  "aadharNumber",
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
  "updatedBy",
  "deletedBy",
  "roleID",
  "companyID",
  "officeID",
  "departmentID",
  "designationID",
  "isAdmin",
  "isRecept",
  "isActive",
];


router.get('/getAdminList', isSuper, adminController.getAdmins);
router.get('/getDataList', isSuper, adminController.getAllData);
router.put('/:id',
    isSuper,
    adminController.updateAdmin);
router.delete('/:id',
    isSuper,
    adminController.deleteAdmin);
router.put('/superAdminPermissions/:id',
    isSuper,
    adminController.superAdminPermissions
)

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
    const fileExts = [".png", ".pdf", ".jpg", ".jpeg", ".gif", ".doc", ".docx", ".mp4"];

    const isAllowedExt = fileExts.includes(
        path.extname(file.originalname.toLowerCase())
    );

    // Mime type must be an image or PDF or document
    const isAllowedMimeType =
        file.mimetype.startsWith("image/") ||
        file.mimetype === "application/pdf" ||
        file.mimetype === "application/msword" ||
        file.mimetype === "video/mp4" ||
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


router.post('/addAdmin',
    AWSHelper.fields([
        { name: 'empAadharCard', maxCount: 1 },
        { name: 'empIdCard', maxCount: 1 },
        { name: 'empProfileImg', maxCount: 1 },
    ]),
    isSuper,
    async (req, res) => {
        try {
            const { Employee } = req.app.locals.models;

            if (req.body) {
                const createdBy = req.decodedEmpCode;

                req.body.isAdmin = true;
                req.body.isActive = true;
                req.body.createdBy = createdBy;
                if (!validator.isEmail(req.body.email)) {
                    res.status(400).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Invalid email id, please provide valid email id",
                    });
                }
                if (!validator.isMobilePhone(req.body.phone.toString(), "any")) {
                    res.status(400).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Invalid phone number, please provide valid phone number",
                    });
                }
                const hashedPassword = await COMMON.ENCRYPT(req.body.password);
                if (!hashedPassword) {
                    return res.status(500).json({
                        response_type: "FAILED",
                        data: {},
                        error: CONSTANT.MESSAGE_CONSTANT.SOMETHING_WENT_WRONG,
                    });
                }
                req.body.password = hashedPassword;

                const isExistEmployeeCode = await Employee.findOne({
                    where: {
                        emp_code: req.body.emp_code,
                    },
                });
                if (isExistEmployeeCode) {
                    res.status(400).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Admin with this Employee Code Already Exist.",
                    });
                }
                const isExistEmailId = await Employee.findOne({
                    where: {
                        email: req.body.email,
                    },
                });
                if (isExistEmailId) {
                    res.status(400).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Admin with this Email Id Already Exist.",
                    });
                }
                const isExistPhoneNo = await Employee.findOne({
                    where: {
                        phone: req.body.phone,
                    },
                });
                if (isExistPhoneNo) {
                    res.status(400).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Admin with this Phone No Already Exist.",
                    });
                }
                const isExistAadharNo = await Employee.findOne({
                    where: {
                        aadharNumber: req.body.aadharNumber,
                    },
                });
                if (isExistAadharNo) {
                    res.status(400).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Admin with this Aadhar No Already Exist.",
                    });
                }

                req.body.empAadharCard = req.files.empAadharCard[0].location;
                req.body.empIdCard = req.files.empIdCard[0].location;
                req.body.empProfileImg = req.files.empProfileImg[0].location;

                if (Array.isArray(req.body.permissions)) {
                    req.body.permissions = req.body.permissions.join(",");
                }

                const employee = await Employee.create(req.body, {
                    fields: inputFieldsEmployee,
                });
                if (employee) {
                    let sender = "rtpl@rtplgroup.com";
                    let subject = "Registeration Successfully Done";
                    let message = `UserID:${employee.emp_code}\nUrl:http://www.rptl.com `;

                    const result = await sendMail(req.body.email, sender, subject, message);
                    if (result.success) {
                        const token = createAccessToken(employee.dataValues);
                        res.setHeader("Authorization", `Bearer ${token}`);
                        res.status(200).json({
                            response_type: "SUCCESS",
                            data: {},
                            message: "Admin registered successfully",
                        });
                    } else {
                        res.status(400).json({
                            response_type: "FAILED",
                            data: {},
                            message: result.message,
                        });
                    }
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
    }
);
router.post('/addReceptionist',
    AWSHelper.fields([
        { name: 'empAadharCard', maxCount: 1 },
        { name: 'empIdCard', maxCount: 1 },
        { name: 'empProfileImg', maxCount: 1 },
    ]),
    isSuper,
    async (req, res) => {
        try {
            const { Employee } = req.app.locals.models;
            const createdBy = req.decodedEmpCode;

            if (req.body) {
                req.body.isRecept = true;
                req.body.isActive = true;
                req.body.createdBy = createdBy;
                if (!validator.isEmail(req.body.email)) {
                    res.status(400).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Invalid email id, please provide valid email id",
                    });
                }
                if (!validator.isMobilePhone(req.body.phone.toString(), "any")) {
                    res.status(400).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Invalid phone number, please provide valid phone number",
                    });
                }
                const hashedPassword = await COMMON.ENCRYPT(req.body.password);
                if (!hashedPassword) {
                    return res.status(500).json({
                        response_type: "FAILED",
                        data: {},
                        message: CONSTANT.MESSAGE_CONSTANT.SOMETHING_WENT_WRONG,
                    });
                }
                req.body.password = hashedPassword;

                const isExistEmployeeCode = await Employee.findOne({
                    where: {
                        emp_code: req.body.emp_code,
                    },
                });
                if (isExistEmployeeCode) {
                    res.status(400).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Admin with this Employee Code Already Exist.",
                    });
                }
                const isExistEmailId = await Employee.findOne({
                    where: {
                        email: req.body.email,
                    },
                });
                if (isExistEmailId) {
                    res.status(400).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Admin with this Email Id Already Exist.",
                    });
                }
                const isExistPhoneNo = await Employee.findOne({
                    where: {
                        phone: req.body.phone,
                    },
                });
                if (isExistPhoneNo) {
                    res.status(400).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Admin with this Phone No Already Exist.",
                    });
                }
                const isExistAadharNo = await Employee.findOne({
                    where: {
                        aadharNumber: req.body.aadharNumber,
                    },
                });
                if (isExistAadharNo) {
                    res.status(400).json({
                        response_type: "FAILED",
                        data: {},
                        message: "Admin with this Aadhar No Already Exist.",
                    });
                }

                req.body.empAadharCard = req.files.empAadharCard[0].location;
                req.body.empIdCard = req.files.empIdCard[0].location;
                req.body.empProfileImg = req.files.empProfileImg[0].location;

                const employee = await Employee.create(req.body, {
                    fields: inputFieldsEmployee,
                });
                if (employee) {
                    let sender = "rtpl@rtplgroup.com";
                    let subject = "Registeration Successfully Done";
                    let message = `UserID:${employee.emp_code}\nUrl:http://www.rptl.com `;

                    const result = await sendMail(req.body.email, sender, subject, message);
                    if (result.success) {
                        const token = createAccessToken(employee.dataValues);
                        res.setHeader("Authorization", `Bearer ${token}`);
                        res.status(200).json({
                            response_type: "SUCCESS",
                            data: {},
                            message: "Receptionist registered successfully",
                        });
                    } else {
                        res.status(400).json({
                            response_type: "FAILED",
                            data: {},
                            message: result.message,
                        });
                    }
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