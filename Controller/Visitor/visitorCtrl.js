const validator = require("validator");
const SendEmailService = require("../../Middleware/emaiService");
const nodemailer = require("nodemailer");
const CONSTANT = require("../../constant/constant");
const Sequelize = require("sequelize");

const inputFieldsRequestmeeting = [
  "vCompanyName",
  "vCompanyAddress",
  "vCompanyContact",
  "vCompanyEmail",
  "purposeOfMeeting",
  "empId",
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
  "vImage",
  "vIDDoc",
];

const inputFieldsRequestmeetingDetailsbyRecp = [
  "companyID",
  "officeID",
  "departmentID",
  "designationID",
  "emp_name",
  "emp_code",
  "TokenNumber",
];

module.exports.visitorRequestMeeting = async (req, res) => {
  try {
    const { RequestMeeting, ReqMeetVisitorDetails } = req.app.locals.models;
    if (req.body) {
      if (!validator.isEmail(req.body.vCompanyEmail)) {
        return res.status(400).json({ error: "Invalid email." });
      }
      if (
        !validator.isMobilePhone(req.body.vCompanyContact.toString(), "any")
      ) {
        return res.status(400).json({ error: "Invalid phone number." });
      }

      const requestMeeting = await RequestMeeting.create(req.body, {
        fields: inputFieldsRequestmeeting,
      });

      if (requestMeeting) {
        //send mail to company of visitor.

        //save images to s3 bucket then replace url with request body data.

        const updatedList = req.body.visitors.map((visitor) => ({
          ...visitor,
          reqMeetingID: requestMeeting.reqMeetingID,
        }));

        console.log(updatedList);

        await Promise.all(
          updatedList.map(async (visitor) => {
            await ReqMeetVisitorDetails.create(visitor, {
              fields: inputFieldsVisitorDetails,
            });
          })
        );

        res.status(200).json({
          message: "Your meeting request has been registered successfully.",
        });
      } else {
        res.status(400).json({
          message:
            "Sorry, Your meeting request has not registered. Please try again later",
        });
      }
    } else {
      console.log("Invalid perameter");
      res.status(400).json({ error: "Invalid perameter" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.getVisitorRequestMeeting = async (req, res) => {
  try {
    const {
      RequestMeeting,
      Employee,
      ReqMeetDetailsByRecp,
      ReqMeetVisitorDetails,
    } = req.app.locals.models;

    const requestMeetings = await RequestMeeting.findAll({
      include: [
        { model: Employee, as: "employee" },
        { model: ReqMeetDetailsByRecp, as: "reqMeetDetailsByRecp" },
        { model: ReqMeetVisitorDetails, required: false, as: "visitorDetails" },
      ],
    });

    if (requestMeetings) {
      res.status(200).json({
        message: "Request Meetings Fetched Successfully.",
        meetings: requestMeetings,
      });
    } else {
      res.status(400).json({
        message: "Request Meetings Can't be Fetched.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.saveTokenByReceptionist = async (req, res) => {
  try {
    const { RequestMeeting, ReqMeetDetailsByRecp } = req.app.locals.models;
    if (req.params && req.body) {
      const { reqMeetingID } = req.params;
      // get value of updatedBy
      // COMMON.setModelUpdatedByFieldValue(req);

      const reqMeetDetailsByRecp = await ReqMeetDetailsByRecp.create(req.body, {
        fields: inputFieldsRequestmeetingDetailsbyRecp,
      });

      if (reqMeetDetailsByRecp) {
        const requestMeeting = await RequestMeeting.findByPk(reqMeetingID);
        if (requestMeeting) {
          requestMeeting.reqMeetDetailsID =
            reqMeetDetailsByRecp.reqMeetDetailsID;
          await requestMeeting.save();
          res
            .status(200)
            .json({ message: "Data and token submited successfully.." });
        } else {
          res.status(400).json({
            message: "ID you've passed is not exist in visitor registration.",
          });
        }
      } else {
        res.status(400).json({
          message: "Data and token can't be submitted, please try again later.",
        });
      }
    } else {
      console.log("Invalid perameter");
      res.status(400).json({ error: "Invalid perameter" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getVisitorListByToken = async (req, res) => {
  try {
    const { RequestMeeting, ReqMeetDetailsByRecp, Employee, ReqMeetVisitorDetails } =
      req.app.locals.models;
    if (req.params) {
      const { TokenNumber } = req.params;

      const reqMeetingDetails = await ReqMeetDetailsByRecp.findOne({
        where: { TokenNumber },
      });

      if (!reqMeetingDetails) {
        return res.status(404).json({ error: "Token and Data not found" });
      }

      const reqMeeting = await RequestMeeting.findOne({
        where: { reqMeetDetailsID: reqMeetingDetails.reqMeetDetailsID },
        include: [
          { model: Employee, as: "employee" },
          { model: ReqMeetDetailsByRecp, as: "reqMeetDetailsByRecp" },
          { model: ReqMeetVisitorDetails, required: false, as: "visitorDetails" },
        ],
      });

      if (reqMeeting) {
        res.status(200).json({
          message: "Request Meeting Fetched Successfully.",
          meetings: reqMeeting,
        });
      } else {
        res.status(400).json({
          message: "Request Meeting Can't be Fetched.",
        });
      }
    } else {
      console.log("Invalid perameter");
      res.status(400).json({ error: "Invalid perameter" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.updateVisitorMeetingStatus = async (req, res) => {
  try {
    const { RequestMeeting } = req.app.locals.models;
    if (req.params && req.body) {
      const { reqMeetingID } = req.params;
      const { ReqStatus, DeclineReason } = req.body;
      // get value of updatedBy
      // COMMON.setModelUpdatedByFieldValue(req);

      const requestMeeting = await RequestMeeting.findOne({
        where: { reqMeetingID },
      });

      if (!requestMeeting) {
        return res.status(404).json({
          error: "Request Meeting not found for the given Request Meeting ID.",
        });
      }

      const updatedReqMeeting = await requestMeeting.update({
        ReqStatus,
        DeclineReason:
          ReqStatus === "ReceptionistRejected" ||
          ReqStatus === "EmployeeRejected"
            ? DeclineReason
            : null,
      });

      if (updatedReqMeeting) {
        res
          .status(200)
          .json({ message: "Status Updated successfully", updatedReqMeeting });
      } else {
        res.status(400).json({
          message: "Status Can't be Updated, Please Try Again Later.",
          updatedReqMeeting,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getVisitorMeetingByEmpID = async (req, res) => {
  try {
    const { RequestMeeting, Employee, ReqMeetDetailsByRecp, ReqMeetVisitorDetails } =
      req.app.locals.models;

    if (req.params) {
      const { empId } = req.params;

      const requestMeetings = await RequestMeeting.findAll({
        where: { empId: empId },
        include: [
          { model: Employee, as: "employee" },
          { model: ReqMeetDetailsByRecp, as: "reqMeetDetailsByRecp" },
          { model: ReqMeetVisitorDetails, required: false, as: "visitorDetails" },
        ],
      });

      if (requestMeetings) {
        res.status(200).json({
          message: "Request Meetings Fetched Successfully.",
          meetings: requestMeetings,
        });
      } else {
        res.status(400).json({
          message: "Request Meetings Can't be Fetched.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getVisitorMeetingByReqMeetingID = async (req, res) => {
  try {
    const { RequestMeeting, Employee, ReqMeetDetailsByRecp, ReqMeetVisitorDetails } =
      req.app.locals.models;

    if (req.params) {
      const { reqMeetingID } = req.params;

      const requestMeetings = await RequestMeeting.findAll({
        where: { reqMeetingID: reqMeetingID },
        include: [
          { model: Employee, as: "employee" },
          { model: ReqMeetDetailsByRecp, as: "reqMeetDetailsByRecp" },
          { model: ReqMeetVisitorDetails, required: false, as: "visitorDetails" },
        ],
      });

      if (requestMeetings) {
        res.status(200).json({
          message: "Request Meetings Fetched Successfully.",
          meetings: requestMeetings,
        });
      } else {
        res.status(400).json({
          message: "Request Meetings Can't be Fetched.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
