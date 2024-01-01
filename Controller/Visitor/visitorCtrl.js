const validator = require("validator");
const sendMail = require("../../Middleware/emaiService");
const cloudinary = require('../../utils/cloudinary');
const { Op } = require('sequelize');

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

//global method to convert file into uri
const uploadAndCreateDocument = async (file) => {
  try {

    const result = await cloudinary.uploader.upload(file[0].path, {
      resource_type: 'auto',
      folder: 'RTPL_DOCS',
    });

    return result.secure_url;
  } catch (error) {
    console.log(error);
    throw new ErrorHandler("Unable to upload to Cloudinary", 400);
  }
};

module.exports.visitorRequestMeeting = async (req, res) => {
  try {
    const { RequestMeeting, ReqMeetVisitorDetails } = req.app.locals.models;
    if (req.body) {
      console.log(req.body);
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

        // const vIDocUrl = await uploadAndCreateDocument(req.files.vIDDoc);
        // const vImageUrl = await uploadAndCreateDocument(req.files.vImage);

        const mailSubject = 'Meeting Request Created';
        const mailMessage = 'Your meeting request has been registered successfully.';

        await sendMail(req.body.vCompanyEmail, "rtpl@rtplgroup.com", mailSubject, mailMessage);


        const updatedList = req.body.visitors.map((visitor,index) => ({
          ...visitor,
          reqMeetingID: requestMeeting.reqMeetingID,
          // vImage : vImageUrl[index],
          // vIDDoc : vIDocUrl[index]
        }));

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

//notification for receptionist
module.exports.getVisitorRequestMeeting = async (req, res) => {
  try {
    const {
      RequestMeeting,
      Employee,
      ReqMeetDetailsByRecp,
      ReqMeetVisitorDetails,
    } = req.app.locals.models;

    let { page, pageSize, sort, sortBy, searchField } = req.query;

    page = Math.max(1, parseInt(page, 10)) || 1;
    pageSize = Math.max(1, parseInt(pageSize, 10)) || 10;

    const offset = (page - 1) * pageSize;

    // Ensure sortOrder is either 'ASC' or 'DESC', default to 'ASC' if undefined
    sort = sort ? sort.toUpperCase() : "ASC";

    const queryOptions = {
      limit: pageSize,
      offset: offset,
      include: [],
    };

    if (sortBy) {
      queryOptions.order = [[sortBy, sort]];
    }

    if (
      searchField &&
      typeof searchField === "string" &&
      searchField.trim() !== ""
    ) {
      queryOptions.where = {
        [Op.or]: [
          { ReqStatus: { [Op.like]: `%${searchField}%` } },
          { purposeOfMeeting: { [Op.like]: `%${searchField}%` } },
          { vCompanyName: { [Op.like]: `%${searchField}%` } },
          { vCompanyContact: { [Op.like]: `%${searchField}%` } },
        ],
      };
    }

    queryOptions.include.push(
      { model: Employee, as: "employee" },
      { model: ReqMeetDetailsByRecp, as: "reqMeetDetailsByRecp" },
      { model: ReqMeetVisitorDetails, required: false, as: "visitorDetails" }
    );

    const requestMeetings = await RequestMeeting.findAll(queryOptions);

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
    res.status(500).json({ error: error.message });
  }
};

module.exports.saveTokenByReceptionist = async (req, res) => {
  try {
    const { RequestMeeting, ReqMeetDetailsByRecp } = req.app.locals.models;
    if (req.params && req.body) {

      const { reqMeetingID } = req.params;
      // get value of updatedBy
      // COMMON.setModelUpdatedByFieldValue(req);

      console.log(req.body);
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
    res.status(500).json({ error: error.message });
  }
};

module.exports.getVisitorListByToken = async (req, res) => {
  try {
    const {
      RequestMeeting,
      ReqMeetDetailsByRecp,
      Employee,
      ReqMeetVisitorDetails,
    } = req.app.locals.models;
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
          {
            model: ReqMeetVisitorDetails,
            required: false,
            as: "visitorDetails",
          },
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
    res.status(500).json({ error: error.message });
  }
};

//notification for employee
module.exports.getVisitorListByCode = async (req, res) => {
  try {
    const {
      RequestMeeting,
      ReqMeetDetailsByRecp,
      Employee,
      ReqMeetVisitorDetails,
    } = req.app.locals.models;
    if (req.params) {
      const { emp_code } = req.params;

      const reqMeetingDetails = await ReqMeetDetailsByRecp.findOne({
        where: { emp_code },
      });

      if (!reqMeetingDetails) {
        return res.status(404).json({ error: "Data not found" });
      }

      const reqMeeting = await RequestMeeting.findOne({
        where: { reqMeetDetailsID: reqMeetingDetails.reqMeetDetailsID },
        include: [
          { model: Employee, as: "employee" },
          { model: ReqMeetDetailsByRecp, as: "reqMeetDetailsByRecp" },
          {
            model: ReqMeetVisitorDetails,
            required: false,
            as: "visitorDetails",
          },
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
    res.status(500).json({ error: error.message });
  }
};

//update meeting schedule (accept or reject)
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
    res.status(500).json({ error: error.message });
  }
};

module.exports.getVisitorMeetingByempId = async (req, res) => {
  try {
    const {
      RequestMeeting,
      Employee,
      ReqMeetDetailsByRecp,
      ReqMeetVisitorDetails,
    } = req.app.locals.models;

    if (req.params) {
      const { empId } = req.params;

      let { page, pageSize, sort, sortBy, searchField } = req.query;

      page = Math.max(1, parseInt(page, 10)) || 1;
      pageSize = Math.max(1, parseInt(pageSize, 10)) || 10;

      const offset = (page - 1) * pageSize;

      // Ensure sortOrder is either 'ASC' or 'DESC', default to 'ASC' if undefined
      sort = sort ? sort.toUpperCase() : "ASC";

      const queryOptions = {
        limit: pageSize,
        offset: offset,
        include: [],
      };

      if (sortBy) {
        queryOptions.order = [[sortBy, sort]];
      }

      if (
        searchField &&
        typeof searchField === "string" &&
        searchField.trim() !== ""
      ) {
        queryOptions.where = {
          [Op.or]: [
            { ReqStatus: { [Op.like]: `%${searchField}%` } },
            { purposeOfMeeting: { [Op.like]: `%${searchField}%` } },
            { vCompanyName: { [Op.like]: `%${searchField}%` } },
            { vCompanyContact: { [Op.like]: `%${searchField}%` } },
          ],
        };
      }

      queryOptions.include.push(
        { model: Employee, as: "employee" },
        { model: ReqMeetDetailsByRecp, as: "reqMeetDetailsByRecp" },
        { model: ReqMeetVisitorDetails, required: false, as: "visitorDetails" }
      );

      queryOptions.where = { ...queryOptions.where, empId: empId, };

      const requestMeetings = await RequestMeeting.findAll(queryOptions);

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
    res.status(500).json({ error: error.message });
  }
};

module.exports.getVisitorMeetingByReqMeetingID = async (req, res) => {
  try {
    const {
      RequestMeeting,
      Employee,
      ReqMeetDetailsByRecp,
      ReqMeetVisitorDetails,
    } = req.app.locals.models;

    if (req.params) {
      const { reqMeetingID } = req.params;

      const requestMeetings = await RequestMeeting.findAll({
        where: { reqMeetingID: reqMeetingID },
        include: [
          { model: Employee, as: "employee" },
          { model: ReqMeetDetailsByRecp, as: "reqMeetDetailsByRecp" },
          {
            model: ReqMeetVisitorDetails,
            required: false,
            as: "visitorDetails",
          },
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
    res.status(500).json({ error: error.message });
  }
};

module.exports.getVisitorsByCompanyContact = async (req, res) => {
  try {
    const {
      RequestMeeting,
      ReqMeetVisitorDetails,
    } = req.app.locals.models;

    const { companyDetail } = req.body;

    if(companyDetail){
      const reqMeeting = await RequestMeeting.findOne({
        where: {
          [Op.or]: [
            { vCompanyContact: companyDetail },
            { vCompanyEmail: companyDetail },
          ],
        },
      });

      if (reqMeeting) {
        const details = await ReqMeetVisitorDetails.findAll({
          where: { reqMeetingID: reqMeeting.reqMeetingID },
        });

        res.status(200).json({
          message: "Visitor Details Fetched Successfully.",
          details: details,
        })
      } else {
        res.status(400).json({
          message: "Previous Meetings Can't be Fetched for Given Company Detail.",
        });
      }
    }
    else{
      console.log("Invalid perameter");
      res.status(400).json({ error: "Invalid perameter" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}