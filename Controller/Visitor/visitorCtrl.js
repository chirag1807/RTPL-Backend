const validator = require("validator");
const sendMail = require("../../Middleware/emaiService");
// const cloudinary = require("../../utils/cloudinary");
const { Sequelize, Op } = require("sequelize");

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


const inputFieldsRequestmeetingDetailsbyRecp = [
  "companyID",
  "officeID",
  "departmentID",
  "designationID",
  "empId",
  "emp_name",
  "emp_code",
  "TokenNumber",
];

//global method to convert file into uri

module.exports.visitorRequestMeeting = async (req, res) => {
  try {
    const { RequestMeeting, ReqMeetVisitorDetails } = req.app.locals.models;
    if (req.body) {
      console.log(req.files)
      if (req.body.vCompanyEmail && !validator.isEmail(req.body.vCompanyEmail)) {
        return res.status(400).json({ 
          response_type: "FAILED",
          data: {},
          message: "Invalid email." });
      }
      if (req.body.vCompanyContact && !validator.isMobilePhone(req.body.vCompanyContact.toString(), "any")) {
        return res.status(400).json({ 
          response_type: "FAILED",
          data: {},
          message: "Invalid phone number." });
      }

      const requestMeeting = await RequestMeeting.create(req.body, {
        fields: inputFieldsRequestmeeting,
      });

      if (requestMeeting) {
        let updatedList = [];
        // console.log(req.vPhotoID,"HK");
        console.log(req.body)
        if (req.vPhotoID.length > 0) {
          let uploadedLiveImages = [];
          let uploadedPhotoIDs = [];
          let uploadedVisitorIDs = [];

          for (const fileData of req.vLiveImage) {
            uploadedLiveImages.push(fileData);
          }

          for (const fileData of req.vPhotoID) {
            uploadedPhotoIDs.push(fileData);
          }
          console.log(req.files)
          for (const fileData of req.vVisitorID) {
            uploadedVisitorIDs.push(fileData);
          }

          console.log(req.body.visitors)
          updatedList = JSON.parse(req.body.visitors).map((visitor, index) => ({
            ...visitor,
            reqMeetingID: requestMeeting.reqMeetingID,
            vLiveImage: uploadedLiveImages[index],
            vPhotoID: uploadedPhotoIDs[index],
            vVisitorID: uploadedVisitorIDs[index]
          }));
        }
        else{
          updatedList = JSON.parse(req.body.visitors).map((visitor, _index) => ({
            ...visitor,
            reqMeetingID: requestMeeting.reqMeetingID,
          }));
        }
        console.log(updatedList)

        await Promise.all(
          updatedList.map(async (visitor) => {
            await ReqMeetVisitorDetails.create(visitor, {
              fields: inputFieldsVisitorDetails,
            });
          })
        );

        const mailSubject = "Meeting Request Created";
        const mailMessage =
          "Your meeting request has been registered successfully.";

        if(requestMeeting.typeOfVisitor == "Company"){
          await sendMail(
            req.body.vCompanyEmail,
            "rtpl@rtplgroup.com",
            mailSubject,
            mailMessage
          );
        }
        else{
          await sendMail(
            JSON.parse(req.body.visitors)[0].vMailID,
            "rtpl@rtplgroup.com",
            mailSubject,
            mailMessage
          )
        }

        res.status(200).json({
          response_type: "SUCCESS",
          data: {},
          message: "Your meeting request has been registered successfully.",
        });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message:
            "Sorry, Your meeting request has not registered. Please try again later",
        });
      }
    } else {
      console.log("Invalid perameter");
      res.status(400).json({ 
        response_type: "FAILED",
        data: {},
        message: "Invalid perameter" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      response_type: "FAILED",
      data: {},
      message: error.message });
  }
};

//notification for receptionist
module.exports.getVisitorRequestMeeting = async (req, res) => {
  try {
    const {
      RequestMeeting,
      // Employee,
      ReqMeetDetailsByRecp,
      ReqMeetVisitorDetails,
      Company,
      Office,
      Department,
      Designation,
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
          { contactPersonName: { [Op.like]: `%${searchField}`}},
          { vCompanyName: { [Op.like]: `%${searchField}%` } },
          { vCompanyContact: { [Op.like]: `%${searchField}%` } },
        ],
      };
    }

    queryOptions.include.push(
      // { model: Employee, as: "employee" },
      { model: ReqMeetDetailsByRecp, as: "reqMeetDetailsByRecp",
      include: [
        { model: Company, as: 'company' },
        { model: Office, as: 'office' },
        { model: Department, as: 'department' },
        { model: Designation, as: 'designation' }
      ]
      },
      { model: ReqMeetVisitorDetails, required: false, as: "visitorDetails" }
    );

    const totalCount = await RequestMeeting.count({
      where: queryOptions.where,
    });
    const totalPage = Math.ceil(totalCount / pageSize);

    const requestMeetings = await RequestMeeting.findAll(queryOptions);

    if (requestMeetings) {
      res.status(200).json({
        totalPage: totalPage,
        currentPage: page,
        response_type: "SUCCESS",
        message: "Request Meetings Fetched Successfully.",
        data: {meetings: requestMeetings},
      });
    } else {
      res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "Request Meetings Can't be Fetched.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      response_type: "FAILED",
      data: {},
      message: error.message });
  }
};

module.exports.getVisitorPendingRequestMeeting = async (req, res) => {
  try {
    const {
      RequestMeeting,
      ReqMeetDetailsByRecp,
      ReqMeetVisitorDetails,
      Company,
      Office,
      Department,
      Designation,
    } = req.app.locals.models;

    let { page, pageSize, sort, sortBy, searchField } = req.query;

    page = Math.max(1, parseInt(page, 10)) || 1;
    pageSize = Math.max(1, parseInt(pageSize, 10)) || 10;

    const offset = (page - 1) * pageSize;

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
        [Op.and]: [
          { ReqStatus: "Pending" },
          {
            [Op.or]: [
              { purposeOfMeeting: { [Op.like]: `%${searchField}%` } },
              { contactPersonName: { [Op.like]: `%${searchField}` } },
              { vCompanyName: { [Op.like]: `%${searchField}%` } },
              { vCompanyContact: { [Op.like]: `%${searchField}%` } },
            ],
          },
        ],
      };
    }

    queryOptions.include.push(
      { model: ReqMeetVisitorDetails, required: false, as: "visitorDetails" }
    );

    const totalCount = await RequestMeeting.count({
      where: queryOptions.where,
    });
    const totalPage = Math.ceil(totalCount / pageSize);

    const requestMeetings = await RequestMeeting.findAll(queryOptions);

    if (requestMeetings) {
      res.status(200).json({
        totalPage: totalPage,
        currentPage: page,
        response_type: "SUCCESS",
        message: "Request Meetings Fetched Successfully.",
        data: {meetings: requestMeetings},
      });
    } else {
      res.status(400).json({
        response_type: "FAILED",
        data: {},
        message: "Request Meetings Can't be Fetched.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      response_type: "FAILED",
      data: {},
      message: error.message });
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
          requestMeeting.ReqStatus = "ReceptionistAccepted"
          requestMeeting.reqMeetDetailsID = reqMeetDetailsByRecp.reqMeetDetailsID;
          await requestMeeting.save();
          res
            .status(200)
            .json({ 
              response_type: "SUCCESS",
              data: {},
              message: "Data and token submited successfully.." });
        } else {
          res.status(400).json({
            response_type: "FAILED",
            data: {},
            message: "ID you've passed is not exist in visitor registration.",
          });
        }
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Data and token can't be submitted, please try again later.",
        });
      }
    } else {
      console.log("Invalid perameter");
      res.status(400).json({ 
        response_type: "FAILED",
        data: {},
        message: "Invalid perameter" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      response_type: "FAILED",
      data: {},
      message: error.message });
  }
};

module.exports.getVisitorListByToken = async (req, res) => {
  try {
    const {
      RequestMeeting,
      ReqMeetDetailsByRecp,
      // Employee,
      ReqMeetVisitorDetails,
      Company,
      Office,
      Department,
      Designation,
    } = req.app.locals.models;
    if (req.params) {
      const { TokenNumber } = req.params;

      const reqMeetingDetails = await ReqMeetDetailsByRecp.findOne({
        where: { TokenNumber },
      });

      if (!reqMeetingDetails) {
        return res.status(404).json({ 
          response_type: "FAILED",
          data: {},
          message: "Token and Data not found" });
      }

      const reqMeeting = await RequestMeeting.findOne({
        where: { reqMeetDetailsID: reqMeetingDetails.reqMeetDetailsID },
        include: [
          // { model: Employee, as: "employee" },
          { model: ReqMeetDetailsByRecp, as: "reqMeetDetailsByRecp",
          include: [
            { model: Company, as: 'company' },
            { model: Office, as: 'office' },
            { model: Department, as: 'department' },
            { model: Designation, as: 'designation' }
          ]
          },
          {
            model: ReqMeetVisitorDetails,
            required: false,
            as: "visitorDetails",
          },
        ],
      });

      if (reqMeeting) {
        res.status(200).json({
          response_type: "SUCCESS",
          message: "Request Meeting Fetched Successfully.",
          data: {meetings: reqMeeting},
        });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Request Meeting Can't be Fetched.",
        });
      }
    } else {
      console.log("Invalid perameter");
      res.status(400).json({ 
        response_type: "FAILED",
        data: {},
        message: "Invalid perameter" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      response_type: "FAILED",
      data: {},
      message: error.message });
  }
};

//notification for employee
module.exports.getVisitorListByCode = async (req, res) => {
  try {
    const {
      RequestMeeting,
      ReqMeetDetailsByRecp,
      // Employee,
      ReqMeetVisitorDetails,
      Company,
      Office,
      Department,
      Designation,
    } = req.app.locals.models;
    if (req.params) {
      const { emp_code } = req.params;

      const reqMeetingDetails = await ReqMeetDetailsByRecp.findOne({
        where: { emp_code },
      });

      if (!reqMeetingDetails) {
        return res.status(404).json({ 
          response_type: "SUCCESS",
          data: {},
          message: "Data not found" });
      }

      const reqMeeting = await RequestMeeting.findOne({
        where: { reqMeetDetailsID: reqMeetingDetails.reqMeetDetailsID },
        include: [
          // { model: Employee, as: "employee" },
          { model: ReqMeetDetailsByRecp, as: "reqMeetDetailsByRecp",
          include: [
            { model: Company, as: 'company' },
            { model: Office, as: 'office' },
            { model: Department, as: 'department' },
            { model: Designation, as: 'designation' }
          ]
          },
          {
            model: ReqMeetVisitorDetails,
            required: false,
            as: "visitorDetails",
          },
        ],
      });

      if (reqMeeting) {
        res.status(200).json({
          response_type: "SUCCESS",
          message: "Request Meeting Fetched Successfully.",
          data: {meetings: reqMeeting},
        });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Request Meeting Can't be Fetched.",
        });
      }
    } else {
      console.log("Invalid perameter");
      res.status(400).json({ 
        response_type: "FAILED",
        data: {},
        message: "Invalid perameter" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      response_type: "FAILED",
      data: {},
      message: error.message });
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
          response_type: "FAILED",
          data: {},
          message: "Request Meeting not found for the given Request Meeting ID.",
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
          .json({ 
            response_type: "SUCCESS",
            message: "Status Updated successfully",
            data: {
              updatedReqMeeting: updatedReqMeeting} });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Status Can't be Updated, Please Try Again Later.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      response_type: "FAILED",
      data: {},
      message: error.message });
  }
};

module.exports.getVisitorMeetingByempId = async (req, res) => {
  try {
    const {
      RequestMeeting,
      // Employee,
      ReqMeetDetailsByRecp,
      ReqMeetVisitorDetails,
      Company,
      Office,
      Department,
      Designation,
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
            { contactPersonName: { [Op.like]: `%${searchField}%` } },
            { vCompanyName: { [Op.like]: `%${searchField}%` } },
            { vCompanyContact: { [Op.like]: `%${searchField}%` } },
          ],
        };
      }

      queryOptions.include.push(
        // { model: Employee, as: "employee" },
        { model: ReqMeetDetailsByRecp, as: "reqMeetDetailsByRecp", 
        where: {
          empId: empId,
        },
        include: [
          { model: Company, as: 'company' },
          { model: Office, as: 'office' },
          { model: Department, as: 'department' },
          { model: Designation, as: 'designation' }
        ] 
        },
        { model: ReqMeetVisitorDetails, required: false, as: "visitorDetails" }
      );

      // queryOptions.where = { ...queryOptions.where, empId: empId };

      const totalCount = await RequestMeeting.count({
        where: queryOptions.where,
      });
      const totalPage = Math.ceil(totalCount / pageSize);

      const requestMeetings = await RequestMeeting.findAll(queryOptions);

      if (requestMeetings) {
        res.status(200).json({
          totalPage: totalPage,
          currentPage: page,
          response_type: "SUCCESS",
          message: "Request Meetings Fetched Successfully.",
          data: {meetings: requestMeetings},
        });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Request Meetings Can't be Fetched.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      response_type: "FAILED",
      data: {},
      message: error.message });
  }
};

module.exports.getVisitorMeetingByReqMeetingID = async (req, res) => {
  try {
    const {
      RequestMeeting,
      // Employee,
      ReqMeetDetailsByRecp,
      ReqMeetVisitorDetails,
      Company,
      Office,
      Department,
      Designation,
    } = req.app.locals.models;

    if (req.params) {
      const { reqMeetingID } = req.params;

      const requestMeetings = await RequestMeeting.findAll({
        where: { reqMeetingID: reqMeetingID },
        include: [
          // { model: Employee, as: "employee" },
          { model: ReqMeetDetailsByRecp, as: "reqMeetDetailsByRecp",
          include: [
            { model: Company, as: 'company' },
            { model: Office, as: 'office' },
            { model: Department, as: 'department' },
            { model: Designation, as: 'designation' }
          ]
          },
          {
            model: ReqMeetVisitorDetails,
            required: false,
            as: "visitorDetails",
          },
        ],
      });

      if (requestMeetings) {
        res.status(200).json({
          response_type: "SUCCESS",
          message: "Request Meetings Fetched Successfully.",
          data: {meetings: requestMeetings},
        });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message: "Request Meetings Can't be Fetched.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      response_type: "FAILED",
      data: {},
      message: error.message });
  }
};

module.exports.getVisitorsByCompanyContact = async (req, res) => {
  try {
    const { RequestMeeting, ReqMeetVisitorDetails } = req.app.locals.models;

    const { companyGST, visitorPAN } = req.body;

    if (companyGST) {
      const reqMeeting = await RequestMeeting.findOne({
        where: { vCompanyGST: companyGST },
      });

      if (reqMeeting) {
        const details = await ReqMeetVisitorDetails.findAll({
          where: { reqMeetingID: reqMeeting.reqMeetingID },
        });

        res.status(200).json({
          response_type: "SUCCESS",
          message: "Visitor Details Fetched Successfully.",
          data: {details: details},
        });
      } else {
        res.status(400).json({
          response_type: "FAILED",
          data: {},
          message:
            "Previous Meetings Can't be Fetched for Given Company Detail.",
        });
      }
    } else if(visitorPAN) {
      
      const details = await ReqMeetVisitorDetails.findAll({
        where: { vPANCard: visitorPAN },
        // group: ['vPANCard', 'vFirstName', 'vLastName'],
        // having: Sequelize.literal('COUNT(*) = 1'),
      });

      res.status(200).json({
        response_type: "SUCCESS",
        message: "Visitor Details Fetched Successfully.",
        data: {details: details},
      });

    } else {
      console.log("Invalid perameter");
      res.status(400).json({ 
        response_type: "FAILED",
        data: {},
        message: "Invalid perameter" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      response_type: "FAILED",
      data: {},
      message: error.message });
  }
};