const validator = require("validator");
const COMMON = require("../../Common/common");
const { createAccessToken } = require("../../Middleware/auth");
const CONSTANT = require("../../constant/constant");
const sendMail = require("../../Middleware/emaiService");
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

module.exports.login = async (req, res) => {
  try {
    const { Employee } = req.app.locals.models;
    if (req.body.email && req.body.password) {
      const employeeDetails = await Employee.findOne({
        where: {
          email: req.body.email,
          isDeleted: false
        },
      });
      if (employeeDetails && employeeDetails.emp_code == req.body.emp_code) {
        const passwordMatch = await COMMON.DECRYPT(
          req.body.password,
          employeeDetails.password
        );
        if (!passwordMatch) {
          return res.status(200).json({
            response_type: "FAILED",
            data: {},
            message: "Invalid credentials, please provide right credentials",
          });
        }
        const token = createAccessToken(employeeDetails.dataValues);
        res.setHeader("Authorization", `Bearer ${token}`);
        res.status(200).json({
          message: "Login successfully",
          response_type: "SUCCESS",
          data: {
            token: token,
            employeeDetails: employeeDetails.dataValues,
          },
        });
      } else if (
        employeeDetails &&
        employeeDetails.emp_code != req.body.emp_code
      ) {
        console.log("Invalid employee code");
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Invalid employee code, please provide valid employee code.",
        });
      } else {
        console.log("Invalid credentials");
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Invalid email, please provide valid email.",
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
    console.log(error);
    res.status(500).json({
      response_type: "FAILED",
      data: {},
      message: error.message,
    });
  }
};
// updateProfile

module.exports.updateProfile = async (req, res) => {
  try {
    const { Employee } = req.app.locals.models;
    const requestData = req.body;
    console.log("requestData", requestData);
    // requestData.empProfileImg = req.files.empProfileImg[0].path;
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
        updateFields.empProfileImg = req.files.empProfileImg[0].path;
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
};



module.exports.Registration = async (req, res) => {
  try {
    const { Employee } = req.app.locals.models;
    const requestData = req.body;

    console.log("requestData", requestData);

    console.log("received files ", req.files);

    if (requestData) {
      
      // get value of CreatedBy
      COMMON.setModelCreatedByFieldValue(req);
      // Validate email
      if (!validator.isEmail(requestData.email)) {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Invalid email id, please provide valid email id",
        });
      }
      // Validate phone number
      if (!validator.isMobilePhone(requestData.phone.toString(), "any")) {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Invalid phone number, please provide valid phone number",
        });
      }
      const hashedPassword = await COMMON.ENCRYPT(requestData.password);
      if (!hashedPassword) {
        res.status(500).json({
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
        res.status(400).json({
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
        res.status(400).json({
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
        res.status(400).json({
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
        // if (result.success) {
        //   const token = createAccessToken(employee.dataValues);
        //   res.setHeader("Authorization", `Bearer ${token}`);
        //   res.status(200).json({
        //     response_type: "SUCCESS",
        //     data: {},
        //     message: "Employee registered successfully",
        //   });
        // } else {
        //   res.status(400).json({
        //     response_type: "FAILED",
        //     data: {},
        //     message: result.message,
        //   });
        // }
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
};

// Change Password
module.exports.changePassword = async (req, res) => {
  try {
    const { sequelize, Employee } = req.app.locals.models;
    if (
      req &&
      req.body &&
      req.body.empId &&
      req.body.currentPassword &&
      req.body.newPassword
    ) {
      if (req.body.empId === req.user.empId || req.user.roleID === -1) {
        const employeeDetails = await Employee.findByPk(req.body.empId);
        if (employeeDetails) {
          // Compare the password
          const passwordMatch = await COMMON.DECRYPT(
            req.body.currentPassword,
            employeeDetails.password
          );
          if (!passwordMatch) {
            return res.status(401).json({
              response_type: "FAILED",
              data: {},
              message: "Invalid Password",
            });
          }
          const hashedPassword = await COMMON.ENCRYPT(req.body.newPassword);
          if (!hashedPassword) {
            return res.status(500).json({
              response_type: "FAILED",
              data: {},
              message: CONSTANT.MESSAGE_CONSTANT.SOMETHING_WENT_WRONG,
            });
          }
          return await Employee.update(
            {
              password: hashedPassword,
            },
            {
              where: {
                empId: req.body.empId,
              },
            }
          )
            .then(() => {
              // Return a success response
              res.status(200).json({
                response_type: "SUCCESS",
                data: {},
                message: "Employee password change successfully",
              });
            })
            .catch((error) => {
              console.error("An error occurred:", error);
              // Return an error response
              res.status(500).json({
                response_type: "FAILED",
                data: {},
                message: error.message,
              });
            });
        } else {
          res.status(404).json({
            response_type: "FAILED",
            data: {},
            message: CONSTANT.MESSAGE_CONSTANT.SOMETHING_WENT_WRONG,
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
};

module.exports.forgotPassword = async (req, res) => {
  try {
    const { Employee } = req.app.locals.models;
    if (req.body) {
      // const decodedData = jwt.verify(
      //   req.headers.authorization.split(" ")[1],
      //   CONSTANT.JWT.SECRET
      // );
      const user = await Employee.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (user) {
        const hashedPassword = await COMMON.ENCRYPT(req.body.newPassword);
        if (!hashedPassword) {
          res.status(500).json({
            response_type: "FAILED",
            data: {},
            message: CONSTANT.MESSAGE_CONSTANT.SOMETHING_WENT_WRONG,
          });
        }
        user.password = hashedPassword;
        const updatedPassword = await user.save();
        if (!updatedPassword) {
          res.status(400).json({
            response_type: "FAILED",
            data: {},
            message: "Password Can not be Setted, Please Try Again Later.",
          });
        }

        res.status(200).json({
          response_type: "SUCCESS",
          data: {},
          message: "User Password Changed Successfully.",
        });
      } else {
        res.status(404).json({
          response_type: "FAILED",
          data: {},
          message: "User with given email id doesn't exist.",
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
};

module.exports.sendCode = async (req, res) => {
  try {
    const { Employee, VerifyCode } = req.app.locals.models;
    if (req.body) {
      // const decodedData = jwt.verify(
      //   req.headers.authorization.split(" ")[1],
      //   CONSTANT.JWT.SECRET
      // );
      const user = await Employee.findOne({
        where: {
          email: req.body.email,
        },
      });
      console.log(user);

      if (user) {
        const verificationCode = Math.floor(1000 + Math.random() * 9000);

        const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
    </head>

    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="background-color: #2196F3; color: white; text-align: center; padding: 20px;">
            <h2>Rise and Grow Group of Companies</h2>
        </div>

        <div style="padding: 20px;">
            <p>Hello ${user.firstName},</p>
            <p>Please verify your email address by entering below code.</p>
            <p>Your verification code is: <strong>${verificationCode}</strong></p>
            <p>If you did not initiate this change, please contact our support team immediately.</p>
            <p>Best regards,<br>Rise and Grow Group of Companies</p>
        </div>
    </body>

    </html>
`;

        let subject = "Verify Your Email";
        await sendMail(
          req.body.email,
          "rtpl@rtplgroup.com",
          subject,
          htmlContent
        );

        const email = await VerifyCode.create({
          verificationCode,
          expiresIn: new Date().getTime() + 300 * 1000,
          email: req.body.newEmail ? req.body.email : user.email,
        });

        const result = await email.save();

        if (result) {
          res.status(200).json({
            response_type: "SUCCESS",
            message: "Verification Code Sent Successfully.",
            data: { result: result },
          });
        } else {
          res.status(403).json({
            response_type: "FAILED",
            data: {},
            message:
              "Verification Code Can not be Sent, Please Try Again Later.",
          });
        }
      } else {
        console.log("User with given email id doesn't exist.");
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "User with given email id doesn't exist.",
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
      message: "Failed to Send Email, Please Try Again Later.",
    });
  }
};

module.exports.verifyCode = async (req, res) => {
  try {
    const { VerifyCode } = req.app.locals.models;
    if (req.body) {
      const codeExists = await VerifyCode.findByPk(req.body.verificationCodeID);

      if (!codeExists) {
        return res.status(404).json({
          response_type: "FAILED",
          data: {},
          message: "Code not found for the given ID",
        });
      }

      if (new Date().getTime() > codeExists.expiresIn) {
        res.status(498).json({
          response_type: "FAILED",
          data: {},
          message: "Verification Code Expired, Please Try Again Later.",
        });
      } else {
        if (codeExists.verificationCode == req.body.coeFromUser) {
          res.status(200).json({
            response_type: "SUCCESS",
            data: {},
            message: "Code Verification Done Successfully.",
          });
        } else {
          res.status(401).json({
            response_type: "FAILED",
            data: {},
            message: "Please Enter Valid Code.",
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
};

module.exports.resetToken = async (req, res) => {
  try {
    if (req.body) {
      const { token } = req.body;
      jwt.verify(token, CONSTANT.JWT.SECRET, async (err, payload) => {
        if (payload) {
          const { iat, exp, ...newObject } = payload;
          const token = createAccessToken(newObject);
          res.setHeader("Authorization", `Bearer ${token}`);
          return res.status(200).json({
            response_type: "SUCCESS",
            data: { token: token },
            message: "Token Reset Done Successfully.",
          });
        } else {
          return res.status(401).json({
            response_type: "FAILED",
            data: {},
            message: "Please Do Login Again",
          });
        }
      });
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
};
